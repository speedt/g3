/*!
 * emag.model
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const path = require('path');
const cwd  = process.cwd();
const conf = require(path.join(cwd, 'settings'));

const uuid = require('node-uuid');

const utils = require('speedt-utils').utils;

const mysql = require('emag.db').mysql;
const redis = require('emag.db').redis;

const cfg = require('emag.cfg');
const biz = require('emag.biz');

const _  = require('underscore');
_.str    = require('underscore.string');
_.mixin(_.str.exports());

const logger = require('log4js').getLogger('model.room');

module.exports = function(opts){
  return new Method(opts);
}

var Method = function(opts){
  var self                      = this;
  self.opts                     = opts || {};
  self.seat_no                  = { 1: 1, 2: 2, 4: 3, 8: 4 };  // 座位号对应关系
  self.id                       = opts.id;
  self.name                     = opts.name          || ('Room '+ opts.id);
  self.fund                     = opts.fund          || 1000;  // 组局基金
  // self.round_count              = opts.round_count   || 4;     // 圈数
  self.round_count              = 1;     // 圈数
  self.visitor_count            = opts.visitor_count || 6;     // 游客人数
  self.round_id                 = utils.replaceAll(uuid.v4(), '-', '');
  self.players                  = {};
  self.users                    = {};
  self.ready_count              = 0;  // 举手人数
  self.create_time              = new Date().getTime();
  self.round_pno                = 1;  // 当前第n局
  self.round_no                 = 1;  // 当前第n把
  self.round_no_first_user_seat = 1;  // 当前第一个起牌的人
  self.user_seat                = 1;  // 当前准备行动的座位
  self.craps_result             = {}; // 骰子 { 1: [1, 2], 2: [3, 4]}
  self.act_status               = 0;  // 0默认 1摇骰子 2庄家设置锅底 3确定庄家，等庄在摇骰子 4闲家下注 5开始发牌
  self.user_seat_banker         = 1;  // 当前庄家座位
  self.user_seat_banker_craps   = []; // 庄家摇骰子结果
  self.user_seat_2              = 1;
};

var pro = Method.prototype;

function se(){
  var self = this;
  switch(self.user_seat){
    case 1: self.user_seat = 2; break;
    case 2: self.user_seat = 4; break;
    case 4: self.user_seat = 8; break;
    case 8: self.user_seat = 1; break;
  }
}

function se2(){
  var self = this;
  switch(self.user_seat_banker){
    case 1: return 1;
    case 2: return 2;
    case 4: return 3;
    case 8: return 4;
  }
}

function se3(aa){
  switch(aa){
    case 1: return 1;
    case 2: return 2;
    case 3: return 4;
    case 4: return 8;
  }
}

/**
 * 庄家下注
 *
 * @return
 */
pro.bankerBet = function(user_id, bet){
  var self = this;

  console.log('----')

  if(2 !== self.act_status) return;  // 庄家下注


  console.log('++++')


  var user = self.users[user_id];
  if(!user) return;  // 用户不存在
  if(self.user_seat_banker !== user.seat) return;  // 你不是庄

  console.log('===')


  user.bet = bet - 0;
  user.bet2 = user.bet;

  console.log(user)

  self.act_status = 3;
};

/**
 * 闲家下注
 *
 * @return
 */
pro.noBankerBet = function(user_id, bet){
  var self = this;

  if(4 !== self.act_status) return;  // 庄家下注

  var user = self.users[user_id];
  if(!user) return;  // 用户不存在
  if(self.user_seat_banker === user.seat) return;  // 你不是闲家

  user.bet = bet - 0;
  user.bet2 = user.bet;
  self.user_seat_2 = user.seat;

  var count = 0;

  for(let i of _.values(self.users)){
    if(0 < i.bet) count++;
  }

  if(3 < count) self.act_status = 5;
};

(() => {
  function firstSeat(){
    var self = this;
    var n = (self.user_seat_banker_craps[0] - 0) + (self.user_seat_banker_craps[1] - 0);
    var m = (n - 0 - 1 + self.seat_no[self.user_seat_banker]) % 4;
    return (0 === m) ? 4 : m;
  }

  /**
   * 庄家摇骰子
   *
   * @return
   */
  pro.crapsBanker = function(user_id){
    var self = this;

    if(3 !== self.act_status) return;  // 庄家摇骰子

    var user = self.users[user_id];
    if(!user) return;  // 用户不存在，不能摇骰子
    if(self.user_seat_banker !== user.seat) return;  // 你不是庄

    self.user_seat_banker_craps = [
      _.random(1, 6),
      _.random(1, 6),
    ];

    self.round_no_first_user_seat = firstSeat.call(self);

    self.act_status = 4;
  };
})();

(() => {
  function maxCraps(){
    var self = this;

    var max  = 0;
    var seat = 0;

    for(let i in self.craps_result){
      let m = (self.craps_result[i][0] - 0) + (self.craps_result[i][1] - 0);
      if(11 < m) return i;

      if(max <= m){
        max = m;
        seat = i;
      }
    }

    return seat;
  }

  /**
   * 4人摇骰子
   *
   * @return
   */
  pro.craps = function(user_id){
    var self = this;

    var user = self.users[user_id];
    if(!user) return;  // 用户不存在，不能摇骰子
    if(0 === user.seat) return;  // 你是游客

    var craps_result = self.craps_result[user.seat];

    // 摇过骰子则返回
    if(craps_result) return craps_result;

    craps_result = self.craps_result[user.seat] = [
      _.random(1, 6),
      _.random(1, 6),
    ];

    // 如果摇骰子的人为4人
    if(3 < _.size(self.craps_result)){
      // 最大的骰子，并设置庄家位置
      self.user_seat_banker = (maxCraps.call(self) - 0);
      self.act_status = 2;
      // self.craps_result = [];  // 重置骰子
    }

    se.call(self);

    return craps_result;
  };
})();

/**
 *
 * @return
 */
pro.release = function(){
  var self = this;

  if(3 < self.ready_count) return false;

  for(let i of _.keys(self.players)){
    delete self.players[i];
  }

  for(let i of _.keys(self.users)){
    delete self.users[i];
  }

  return true;
};

/**
 *
 * @return
 */
pro.entry = function(user){
  if(!user) return Promise.reject('invalid_params');
  if(!user.id) return Promise.reject('invalid_params');

  var self = this;

  if(self.users[user.id]) return Promise.reject('已经进入该房间');
  if((self.visitor_count - 0 + 3) < _.size(self.users)) return Promise.reject('房间满员');

  user.seat = getSeatNum.call(self);

  self.users[user.id] = user;

  if(0 < user.seat){
    self.players[user.seat] = user.id;
  }

  return Promise.resolve(user);
};

/**
 *
 * @return
 */
pro.reEntry = function(user){
  var _user = this.users[user.id];

  if(!_user) return;

  _user.server_id = user.server_id;
  _user.channel_id = user.channel_id;

  if(0 < _user.seat) _user.is_quit = 0;
}

/**
 *
 * @return
 */
pro.quit = function(user_id){
  var self = this;

  var user = self.users[user_id];
  if(!user) return true;

  if((3 < self.ready_count) && (0 < user.seat)){
    user.is_quit = 1;
    user.quit_time = new Date().getTime();
    return false;
  }

  if(0 < user.seat){
    if(1 === user.ready_status) self.ready_count--;
    delete self.players[user.seat];
  }

  delete self.users[user_id];
  return true;
};

/**
 *
 * @return
 */
pro.ready = function(user_id){
  var self = this;

  if(self.round_count < self.round_pno) return;
  if(4 < self.round_no) return;

  if(3 < self.ready_count) return self.ready_count;

  var user = self.users[user_id];
  if(!user) throw new Error('用户不存在，不能举手');

  if(0 === user.seat) return self.ready_count;
  if(1 === user.ready_status) return self.ready_count;

  user.ready_status = 1;

  if(3 < (++self.ready_count)){
    self.act_status = 1;

    // 生成36张牌
    self.pai36 = CreateCards();
  }

  se.call(self);

  return self.ready_count;
};

/**
 *
 * @return
 */
function getSeatNum(){
  switch(seatCount.call(this)){
    case 0:  return 1;
    case 1:  return 2;  // base
    case 2:  return 1;  // base
    case 3:  return 4;
    case 4:  return 1;  // base
    case 5:  return 2;
    case 6:  return 1;
    case 7:  return 8;
    case 8:  return 1;  // base
    case 9:  return 2;
    case 10: return 1;
    case 11: return 4;
    case 12: return 1;
    case 13: return 2;
    case 14: return 1;
    default: return 0;
  }
}

/**
 *
 * @return
 */
function seatCount(){
  var arr = _.keys(this.players);

  var count = 0;

  for(let i of arr){
    count += (i - 0);
  }

  return count;
}

/**
 * 亮牌
 * 
 */
pro.liangpai = function(){
  var self = this;

  var arr = [];

  for(var i=0;i<8;i++){
    arr.push(self.pai36.shift());
  }

  self.pai8 = arr;

  var wanjiadianshu = CompareCard(arr);

  // 下注数
  var xiazhushu = [self.users[self.players[1]].bet2, self.users[self.players[2]].bet2, self.users[self.players[4]].bet2, self.users[self.players[8]].bet2];

  console.log(xiazhushu)
  console.log('++++')

  // 元宝数
  var yuanbaoshu = [100, 100, 100, 100];

  var seatno = self.round_no_first_user_seat;

  for(var i=0;i<4;i++){

    var aaa = se2.call(self);

    if(aaa != seatno) {
      var aa = Checkout(wanjiadianshu, xiazhushu, yuanbaoshu, se2.call(self), seatno);
      self.users[self.players[self.user_seat_banker]].bet2 -= aa.score;
      self.users[self.players[se3(seatno)]].bet2 += aa.score;

      if(aa.goldseat){
        self.users[self.players[se3(aa.goldseat)]].yuanbao--;
      }
    }

    seatno++;

    if(4 < seatno) seatno = 1;
  }

  // 入库

  for(let i of _.values(self.users)){
    if(0 < i.bet){

      mysql.query(sql, [
        utils.replaceAll(uuid.v4(), '-', ''),
        self.id,
        new Date(),
        i.id,
        self.round_id,
        self.round_pno,
        self.round_no,
        i.bet,
        i.bet2,
        i.seat,
      ], (err) => {
        console.log(err);
      });
    }
  }

  self.round_no++;

  if(4 < self.round_no) self.ready_count = 0;
  // if(4 < self.round_no) self.round_pno++;

  if(4 < self.round_pno) self.ready_count = 0;

  self.act_status = 3;
}

var sql = 'insert into g_group_result (id, group_id, create_time, user_id, round_id, round_pno, round_no, bet, bet2, seat) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'


function SeatTran(seat){
        if(seat >2){
            if(seat == 4) return 3;
            else return 4;
        }else return seat;
    }


function CreateCards(){//num =36  不带白板 40带白板    
  //----------
  var num =36;
  //----------
  var cards=[];
  var p =1;
  for(let i = 0;i<num;i+=4)
      cards[i]= cards[i+1] = cards[i+2] =cards[i+3] =p++;
  

  var max = num-1;
  for(let i = 0;i<num;i++){
      let r  = Math.round(Math.random()*max);            
      p = cards[r];
      cards[r] = cards[max]; 
      cards[max--] =p;
  }
  return cards;
}


 function GetPoint(c1,c2){
        var p = 0;
        if(c1 != c2) p = (c1+c2)%10;
        else  p = 10+c1;

        return p;
    }


function CompareCard(cards){//这一次比较的牌（8张）//  第一个和庄家比的人的位置  
        var playerpoint=[];
        var seat =1;

        for(let i =0;i<cards.length;i+=2){
            playerpoint[seat-1] = GetPoint(cards[i],cards[i+1]);

            //顺时针
            if( ++seat  > 4)    seat =1;
            //逆时针
            //if( --seat < 0 )    seat =4;
        }
        
        return playerpoint;//返回每个座位的点数大小
    }


    function Checkout(playerpoint,playerbet,playergold,banker,playerseat){ //点数结果, //玩家下注数 //玩家元宝数 //庄家位置 //比较的闲家位置(钓鱼者为下注的座号)
        var result={};
        
        if(playerpoint[ playerseat-1 ] > playerpoint[banker-1]){//玩家点数大于庄家
            
            if(playerpoint[ playerseat-1 ]>10){ //是否为对
                if( playergold[ playerseat-1 ] <1 )  //是否有元宝
                    result.score =0;              
                else{
                    result.score =  playerbet[ playerseat-1 ];
                    result.goldseat = playerseat;
                }
            }else
                 result.score =  playerbet[ playerseat-1 ];
            
        }else{
             if(playerpoint[ banker-1 ]>10){
                 if( playergold[ banker-1 ] <1 )  //是否有元宝
                    result.score =0;              
                else{
                    result.score =  -playerbet[ playerseat-1 ];
                    result.goldseat = banker;
                }
             }else
                result.score = -playerbet[ playerseat-1 ];             
        }      
            
        return result; 
        //----result 返回值 说明-------
        //result.score 两人输赢分 ，庄家分   -= result.score    闲家分 += result.score 
        //result.goldseat 若存在，表示要扣除元宝的人的座位，数量为 1
    }