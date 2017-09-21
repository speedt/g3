/*!
 * emag.model
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const assert = require('assert');

const path = require('path');
const cwd  = process.cwd();
const conf = require(path.join(cwd, 'settings'));

const uuid  = require('node-uuid');
const utils = require('speedt-utils').utils;

const _  = require('underscore');
_.str    = require('underscore.string');
_.mixin(_.str.exports());

const logger = require('log4js').getLogger('model.room');

const DIRECTION_CLOCKWISE     = 1;  // 顺时针
const DIRECTION_ANTICLOCKWISE = 0;  // 逆时针

// const ACT_STATUS_READY  = 'ACT_STATUS_READY';

// const ACT_STATUS_CRAPS4_BEFORE = 'ACT_STATUS_CRAPS4_BEFORE';
// const ACT_STATUS_CRAPS4        = 'ACT_STATUS_CRAPS4';
// const ACT_STATUS_CRAPS4_AFTER  = 'ACT_STATUS_CRAPS4_AFTER';

// const ACT_STATUS_BANKER_BET_BEFORE = 'ACT_STATUS_BANKER_BET_BEFORE';
// const ACT_STATUS_BANKER_BET        = 'ACT_STATUS_BANKER_BET';
// const ACT_STATUS_BANKER_BET_AFTER  = 'ACT_STATUS_BANKER_BET_AFTER';

const AS_READY  = 'AS_READY';
const AS_PLAYER_DICE = 'AS_PLAYER_DICE';//玩家摇色子
const AS_DELAY_PLAYER_DICE ='AS_DELAY_PLAYER_DICE';//延迟 显示玩家打色子结果
const AS_WAIT_FOR_PLAYER_DICE ='AS_WAIT_FOR_PLAYER_DICE';//等待玩家摇色子
//timeOut_PlayerDice

 const AS_BANKER_BET = 'AS_BANKER_BET';
 const AS_DELAY_BANKER_BET= 'AS_DELAY_BANKER_BET';//延迟 显示庄家下底结果
 const AS_WAIT_FOR_BANKER_BET ='AS_WAIT_FOR_BANKER_BET';//等待庄家下底
 //timeOut_Banker_Bet

 const AS_BANKER_DICE ='AS_BANKER_DICE';
 const AS_DELAY_BANKER_DICE ='AS_DELAY_BANKER_DICE';//延迟 显示庄家摇色结果
 const AS_WAIT_FOR_BANKER_DICE ='AS_WAIT_FOR_BANKER_DICE';//等待庄家打色子选第一个起牌的人
 const AS_WAIT_FOR_BANKER_CONTINUE_DICE ='AS_WAIT_FOR_BANKER_CONTINUE_DICE';//等待庄家打色子选第一个起牌的人
 //timeOut_Banker_Dice

const AS_PLAYER_BET ='AS_PLAYER_BET';
const AS_DELAY_PLAYER_BET ='AS_DELAY_PLAYER_BET';//
const AS_WAIT_FOR_PLAYER_BET='AS_WAIT_FOR_PLAYER_BET';//等待非庄玩家下注
//timeOut_PlayerBet_Finish

const AS_DELAY_DEALCARD = 'AS_DELAY_DEALCARD';//发牌

const AS_COMPARE_CARD ='AS_COMPARE_CARD';//比牌
const AS_DELAY_COMPARE_CARD='AS_DELAY_COMPARE_CARD';//延迟比牌结果
const AS_DELAY_COMPARE_CARD2 = 'AS_DELAY_COMPARE_CARD2';
const AS_DELAY_COMPARE_CARD3 = 'AS_DELAY_COMPARE_CARD3';


const AS_BANKER_CONTINUE_BET='AS_BANKER_CONTINUE_BET';//庄家续庄
const AS_WAIT_FOR_BANKER_CONTINUE_BET = 'AS_WAIT_FOR_BANKER_CONTINUE_BET';//等待庄家续庄
//timeOut_Banker_Continue_Bet
const AS_DELAY_BANKER_CONTINUE_BET = 'AS_DELAY_BANKER_CONTINUE_BET';

const AS_RESULT ='AS_RESULT';//结算结果
const AS_WAIT_FOR_NEXT_ROUND= 'AS_WAIT_FOR_NEXT_ROUND';//等待下回合开始
const AS_WAIT_FOR_NEXT_ROUND2= 'AS_WAIT_FOR_NEXT_ROUND2';//等待下回合开始
const AS_DELAY_NEXT_ROUND ='AS_DELAY_NEXT_ROUND' ;//

const AS_WAIT_FOR_BANKER_CONTINUE = 'AS_WAIT_FOR_BANKER_CONTINUE';
const AS_DELAY_BANKER_CONTINUE ='AS_DELAY_BANKER_CONTINUE';

const AS_GAMEOVER = 'AS_GAMEOVER';

module.exports = function(opts){
  return new Method(opts);
}

var Method = function(opts){
  var self  = this;
  self.opts = opts;

  self.id   = opts.id;
  self.name = opts.name || ('Room '+ opts.id);

  self._users   = {};
  self._players = {};

  self.create_user_id = opts.user_id;
  self.create_time    = new Date().getTime();

  self. act_seat      = 1;
  self. act_status    = AS_READY;
  self._act_direction = DIRECTION_CLOCKWISE;

  self._free_seat    = [1, 2, 3, 4];
  self._player_count = self._free_seat.length;
  self.visitor_count = opts.visitor_count || 0;  // 游客人数

  self.fund          = opts.fund          || 0;
  self.curr_fund         =  0 ;
  self.round_count   = opts.round_count   || 4;

  self.round_num             = 0;  // 当前第n局
  self.hand_num              = 1;  // 当前第n手

  self.result      = []; // 牌比对结果

  self.banker_seat = 0;                // 庄家座位

  self.first_seat   = 1;  // 庄家摇骰子确定第一个起牌人的座位 
  self.compare_seat = 1;  // 待比牌人的座位

  self.banker_bet = 0;              // 庄家锅
  self.chips = [2000, 3000, 5000];  //可用的筹码

  //------------911---------------//
  self.delaytime =0;//延迟时间
  self.specialflag =0;//d多功能特殊标志位
  //------------------------------//
};

var pro = Method.prototype;

//设置 作弊玩家
pro.setHacke = function(user_id){
  this._users[user_id].opts.hacker = true;
}

pro.getCompareUser = function(seat){
  var self = this;  

  if(  self.getUserBySeat(seat).opts.bet[seat]>0  ){

     var user = self.getUserBySeat(seat);
     if(user.opts.seat == self._banker_seat)
        self.first_seat =self.getNextSeatBySeat(user.opts.seat);

      return self.getUserBySeat(self.first_seat);
  }else {
      //var users = self.getUsers();

      //先查有没有在此位下注的钓鱼者      
      for(let i of _.values(self._users)){
        if(i.opts.bet[seat]>0 )//在此位置下过注，
          return i;
      }

      //没有则返回下一个坐位的玩家
      self.first_seat =self.getNextSeatBySeat(seat);
      if(self.first_seat == self.banker_seat)
        self.first_seat =self.getNextSeatBySeat(self.first_seat);

      var player =   self.getUserBySeat(self.first_seat);
      if(player.opts.bet[self.first_seat]>0)
          return  player;
      else
          return null;
  }
};

/**
 * 生成36
 *
 * @return
 */
function genCards(num){
  num = num || 36;

  var cards = [];
  var p     = 1;

  for(let i = 0; i < num; i += 4){
    cards[i] = cards[i + 1] = cards[i + 2] = cards[i + 3] = p++;
  }

  var max = num - 1;

  for(let i = 0; i < num; i++){
    let r        = Math.round(Math.random() * max);
    p            = cards[r];
    cards[r]     = cards[max];
    cards[max--] = p;
  }

  return cards;
}

/**
 *
 * @param seat_no
 * @return
 */
pro.getNextSeatBySeat = function(seat_no){
  seat_no -= 0;
  return (this._player_count < (++seat_no)) ? 1 : seat_no;
};

/**
 *
 * @return
 */
pro.getUser = function(id){
  return this._users[id];
};

/**
 * 获取所有用户
 *
 * @return
 */
pro.getUsers = function(){
  return this._users;
};

pro.getUserBySeat = function(id){
  return this._players[id];
};

/**
 * 判断是否是
 *
 * @return
 */
pro.isPlayer = function(user){
  return 0 < user.opts.seat;
};

/**
 *
 * @return
 */
pro.isReady = function(user){
  return 0 < user.opts.is_ready;
};

/**
 *
 * @return
 */
pro.isQuit = function(user){
  return 0 < user.opts.is_quit;
};



/**
 * 判断是否游戏是否开始
 *
 * @return
 */
pro.isStart = function(){
  return this._player_count <= this.getReadyCount();
};

/**
 * 获取举手人数
 *
 * @return
 */
pro.getReadyCount = function(){
  var count = 0;

  for(let i of _.values(this._players)){
    if(this.isReady(i)) ++count;
  }

  return count;
};

/**
 *
 * @return
 */
pro.release = function(){
  return 1 > this.getUserCount();
};

/**
 *
 * @return
 */
pro.getUserCount = function(){
  return _.size(this._users);
};

/**
 * 房间满了吗？
 *
 * @return boolean
 */
pro.isFull = function(){
  return (this._player_count + this.visitor_count) <= this.getUserCount();
};

//  检测用户合法性------------------
pro.isValidUser = function(id,status){
    var self = this;
    var err =null

    if(self.act_status !== status)  return [err='STATUS_ERROR',null];

    var user = self.getUser(id);
    if(!user)                      return [err ='USER_ERROR',null];

    if(self.act_seat !== user.opts.seat) return [err ='SEAT_ERROR',null];

    return [err,user];
};

(function(){
  /**
   * 进入群组
   *
   * @return
   */
  pro.entry = function(user){
    var self = this;

    if(self.act_status != AS_READY) return '游戏已开始';
    if(self.getUser(user.id)) return '已在房间';
    if(self.isFull())         return '房间满员';

    user.opts = {};

    setSeat.call(self, user);

    self._users[user.id] = user;

    user.opts.entry_time = new Date().getTime();
    user.opts.score      = 0;
    user.opts.is_quit    = 0;
    user.opts.is_ready   = 0;

    user.opts.bet = [0,0,0,0,0];
    user.opts.gold =0;
    user.opts.hacker = false;   

    user.opts.fund =0;
    user.opts.fund_count=0;

    return user;
  };

  function setSeat(user){
    var seat_no = this._free_seat.shift();
    if(!(0 < seat_no)) return;

    this._players[seat_no] = user;
    user.opts.seat         = seat_no;
  }
})();

/**
 *
 * @return
 */
pro.re_entry = function(user){
  var self = this;

  var _user = self.getUser(user.id);
  if(!_user) return '不在群组';

  _user.opts.re_entry_time = new Date().getTime();
  _user.opts.is_quit       = 0;

  _user.server_id  = user.server_id;
  _user.channel_id = user.channel_id;

  return _user;
}

/**
 * 退出群组
 *
 * @return
 */
pro.quit = function(user_id){
  var self = this;

  var _user = self.getUser(user_id);
  if(!_user) return true;

  if(self.isPlayer(_user)){
    if(self.isStart()){
      _user.opts.quit_time = new Date().getTime();
      _user.opts.is_quit   = 1;
      return false;
    }

    self._free_seat.push(_user.opts.seat);
    delete self._players[_user.opts.seat];
  }

  return (delete self._users[user_id]);
};

//------------------------------------------------------------------
//------------------------------------------------------------------
//------------------------------------------------------------------
/**
 *
 * @return
 */
pro.ready = function(user_id){
  var self = this;

  if(self.act_status !== AS_READY) return 'AS_READY';
  if(self.isStart())                       return '已经开始';

  var _user = self.getUser(user_id);
  if(!_user)                return '用户不存在';

  if(!self.isPlayer(_user)) return '不能举手';
  if( self.isReady (_user)) return '已经举手';

  _user.opts.is_ready = 1;
 

  if(self.isStart()){
    self.act_status = AS_WAIT_FOR_PLAYER_DICE;
    self.act_seat   = self.banker_seat || 1;
    self._cards_36  = genCards();
  }

  self.delaytime =10;
  return [self.getUsers(), [
    self.act_status,
    self.delaytime,
    self.act_seat
  ]];
  //TIME OUT PLAYER DICE   10s
};

(function(){
  /**
   *
   * @return
   */
  pro.craps4 = function(user_id){
      var self = this;

      var data = self.isValidUser(user_id,AS_WAIT_FOR_PLAYER_DICE);
      var user;
      if(data[0]==null)
          user = data[1];
      else
         console.log(data[0]);     
      
      if(user.opts.craps)                  return 'craps';

      user.opts.craps = [ _.random(1, 6), _.random(1, 6) ];

      if(self._player_count <= getCrapsCount.call(self)){

        self.banker_seat = maxCraps.call(self);
        self.round_num++;
        self.act_seat    = self.banker_seat;
      }

      self.act_status = AS_DELAY_PLAYER_DICE;      
      self.delaytime=5;

      return [self.getUsers(),[
        self.act_status,
        self.delaytime,
        self.act_seat,
        user.opts.craps
      ]];    

      //delay player dice  5s
  };



  function getCrapsCount(){
    var count = 0;

    for(let i of _.values(this._players)){
      if(i.opts.craps) count++;
    }

    return count;
  }

  /**
   * 计算最大的
   *
   * @return seat
   */
  function maxCraps(){
    var max = 0, seat = 0;

    for(let i of _.values(this._players)){
      let m = i.opts.craps[0] - 0 + i.opts.craps[1];
      if(11 < m) return i.opts.seat;

      if(max <= m){
        max  = m;
        seat = i.opts.seat;
      }
    }

    return seat;
  }
})();

/**庄家下底，返回庄下的底数
 *状态为  打色子 选第一个起牌人位置
 */
//
pro.bankerBet = function(user_id, bet){
    var self = this;

    var data = self.isValidUser(user_id,AS_WAIT_FOR_BANKER_BET);
    var user;

    if(data[0]==null)
        user = data[1];
    else
       console.log(data[0]); 

    
    self.act_seat = self.banker_seat;
 
    if( self.chips.length>0 && bet > 0)
      self.banker_bet = self.chips.shift();
    if( self.chips.length>0 && bet > 2000)
        self.banker_bet = self.chips.shift();
    if( self.chips.length>0 && bet > 3000)
        self.banker_bet = self.chips.shift();    
 
    self.act_status =  AS_DELAY_BANKER_BET;
    self.delaytime=3;

    return [self.getUsers(),[
      self.act_status,
      self.delaytime,
      self.act_seat,
      bet,
    ]]; 
    //delay  banker bet   5s
};

(function(){
  /**
   *庄家打完色子，确定第一起牌人
   * @return
   */
  pro.bankerDice = function(user_id){      
      
      var self = this;
       
      if(self.act_status !== AS_WAIT_FOR_BANKER_DICE && self.act_status !== AS_WAIT_FOR_BANKER_CONTINUE_DICE) return 'AS_WAIT_FOR_BANKER_DICE';      
       
      var user = self.getUser(user_id);

      if(!user)                            return '用户不存在'; 
        
      if(self.banker_seat !== user.opts.seat) return '还没轮到你';
      
      user.opts.craps = [ _.random(1, 6), _.random(1, 6) ];
      self.first_seat = firstSeat(self.banker_seat,user.opts.craps);

      self.act_status = AS_DELAY_BANKER_DICE;
      self.delaytime=5      

      return [self.getUsers(),[
        self.act_status,
        self.delaytime,
        self.act_seat,
        user.opts.craps
      ]];  

      //delay banker bet 5s
  };

  /**
   * 第一个起牌的位置
   *
   * @return
   */
  function firstSeat(seat, craps){
    var m = (craps[0] + craps[1] - 1 + seat) % 4;
    return (0 === m) ? 4 : m;
  }
})();


 /**
   *非庄玩家下注
   * 
   */
(function(){
 
  pro.unBankerBet = function(user_id, data){
      var self = this;
      if(self.act_status !== AS_WAIT_FOR_PLAYER_BET) return 'AS_WAIT_FOR_PLAYER_BET';

      var user = self.getUser(user_id);
      if(!user)                            return '用户不存在';

      //var bet = data[0];            //911
      //var betseat = data[1];        //911

      //bet  = getBet.call(self,bet);

      // if( user.opts.bet[betseat]) 
      //     return '该玩家已下过注';  // 下过注，则返回
      // else
      //     user.opts.bet[betseat] = bet;

      user.opts.bet = data;//[0,0,0,0,0]
      //self.delaytime=0;
      return [self.getUsers(),[
        self.act_status,
        self.delaytime,
        user.id,
        user.opts.seat,
        user.opts.bet,       
      ]];

  };

  //验证非庄下注数据
  function getBet(bet){
    return bet;
  }
})();

(function(){
  /**
   *比牌
   * @return
   */
  pro.compareCard = function(player){
      var self = this;

      //var player = self.getUserBySeat(self.first_seat);

      return checkout({
        seat:self.banker_seat,
        bet:self.banker_bet,
        //gold:self.getUserBySeat(self.banker_seat).gold_count,
        point:getPoint.call(self,self.banker_seat)
      },{
        seat:self.first_seat,
        bet:player.opts.bet[self.first_seat],
        //gold:player.gold_count,
        point:getPoint.call(self,self.first_seat)
      });    
  };

  function getPoint(seat){
    var self = this;

    var c1 = self._cards_8[(seat - 1) * 2];
    var c2 = self._cards_8[(seat - 1) * 2 + 1];

    return (c1 !== c2) ? ((c1 + c2) % 10) : (10 + c1);
  }

  // function getCompareSeat(){
  //   var self = this;
  // }
})();

//庄家回应是否继续坐庄
(function(){
  
    pro.banker_Continue =  function(user_id,answer){
      //返回庄家续庄数
      var self = this;      
      
      var user = self.getUser(user_id);
      if(!user)        return '用户不存在';      

      if(user.opts.seat !== self.banker_seat) return '不是庄家';

      if(answer==='true'){
          
          self.act_seat = self.banker_seat;

          self.act_status = AS_WAIT_FOR_PLAYER_BET;
          self.delaytime=20;

          return [self.getUsers(),[
            self.act_status,
            self.delaytime                  
          ]];
      }else{

            //庄家不续庄
            if(self.round_num >= self.round_count*4){
            self.act_status = AS_GAMEOVER;

            //总结算表
            var result=[];
            for(let u of _.values(self.getUsers()) ) {
                u.opts.is_ready =0;
                result.push({
                  id:u.id,
                  nick:u.nickname,
                  seat:u.opts.seat,
                  //gold:u.gold_count,
                  score:u.opts.score,
                  fund:u.opts.fund_count,
                });
            }

            self.delaytime=0;
            return [self.getUsers(),
                      [ self.act_status,
                        self.delaytime,
                        result
                      ]]; 
          }


          //下一家坐庄          
          self.banker_seat = self.getNextSeatBySeat(self.banker_seat);
          self.banker_bet=0;
          self.round_num++;
          self.chips = [2000,3000,5000];

          self.act_seat = self.banker_seat;

          self.act_status = AS_WAIT_FOR_BANKER_BET;          
          self.delaytime=20;

          return [self.getUsers(),[
            self.act_status,
            self.delaytime,
            self.act_seat,        
          ]];
      }     

      //delay banker continue bet
    }
  
})();

//庄家续庄XIA GUO DI
(function(){
  
    pro.banker_Continue_Bet =  function(user_id,bet){
      //返回庄家续庄数
      var self = this;      
      
      var user = self.getUser(user_id);
      if(!user)        return '用户不存在';      

      if(user.opts.seat !== self.banker_seat) return '不是庄家';

      
      bet = bet-0;      
      if( self.chips.length>0 && bet > 2000)
        self.banker_bet = self.chips.shift();
      if( self.chips.length>0 && bet > 3000)
        self.banker_bet = self.chips.shift();    


      self.act_status = AS_DELAY_BANKER_CONTINUE_BET;
      self.delaytime=3;

      return [self.getUsers(),[
        self.act_status,
        self.delaytime,
        self.banker_seat,
        self.banker_bet
      ]];

      //delay banker continue bet
    }
  
})();

//----------------------延迟处理部分----------------------
//
//显示完玩家摇色子后  延迟数秒后处理的内容
(function(){
  
    pro.delay_PlayerDice = function(){
      var self = this;

      if(self.banker_seat >0){

         self.act_status = AS_WAIT_FOR_BANKER_BET;
         self.delaytime=20;

         return [self.getUsers(),[
           self.act_status,
           self.delaytime,
           self.banker_seat,
         ]];

         //time out banker bet  20s

      }else{

        self.act_seat = self.getNextSeatBySeat(self.act_seat);

         self.act_status = AS_WAIT_FOR_PLAYER_DICE; 
        self.delaytime=10;

        return [self.getUsers(),[
          self.act_status,
          self.delaytime,
          self.act_seat
        ]];
        //time out player dice 10s
      }
    };
  
    
  })();

//显示完庄家下的底后，延迟处理的内容
(function(){

    pro.delay_BankerBet = function(){
      var self = this;
      
      self.act_seat =  self.banker_seat;

      self.act_status = AS_WAIT_FOR_PLAYER_BET;
      self.delaytime=20;

      return [self.getUsers(),[
        self.act_status,
        self.delaytime,
        self.act_seat
      ]];
    };
    //time out banker dice
})();


//显示完庄家摇完色子后，延改处理的内容
(function(){
  
      pro.delay_BankerDice = function(){
        var self = this;
        //self.act_status = AS_WAIT_FOR_PLAYER_BET;        
          
        

      self._cards_8 = self._cards_36.splice(0,8);

       // self._cards_8[(self.banker_seat-1)*2]=1;
       // self._cards_8[(self.banker_seat-1)*2+1]=9;

        //开启后台换牌作弊
        self._card_8 = hackCard.call(self,self._card_8 );

        self.act_status = AS_DELAY_DEALCARD; 
        self.delaytime=3;

        return [self.getUsers(),[
          self.act_status,
          self.delaytime,
          self.first_seat,
          self._cards_8,
        ]];       
      };

      //黑牌
    function hackCard(cards){
      var self = this;
      //查询开启的作弊玩家
      var hacker = null;
      for(let i of _.values(self._users)){
          if(i.opts.hacker === true){
            hacker = i;
            break;
          }
      }
      if(hacker==null) return cards;

      hacker.opts.hacker = false;
      //查询该玩家下注的作位号
      var seat = 0;
      for(let i of _.values(hacker.opts.bet)){
          if(i >0){
            seat =i;
            break;
          }
      }

      if(seat >0){
          //取最大的牌进行调换
          var max=0;
          var maxseat =0;

          for(let i=0;i<4;i++){
            var curr = ( cards[i*2]!== cards[i*2+1] )?((  cards[i*2] + cards[i*2+1] )%10):(10+cards[i*2]);
            if(curr > max) {              
              max =curr;    
              maxseat = i+1;          
            }
          }

          var c1 = cards[seat*2];
          var c2 = cards[seat*2+1];

          cards[seat*2] = cards[maxseat*2];
          cards[seat*2+1] = cards[maxseat*2+1];

          cards[maxseat*2] = cards[eat*2];
          cards[maxseat*2+1] = cards[seat*2+1];         


      }else{
        //该玩家未下注，不处理
      }      
  
      return cards;
    };

    //delay dealcard 5s

  })();

//所有闲家下完注的延迟处理
(function(){
    pro.delay_PlayerBet = function(){
      var self = this;
        //self.act_status = AS_DELAY_DEALCARD;

        self.act_status = AS_WAIT_FOR_BANKER_DICE;
        self.delaytime=10;

        return [self.getUsers(),[
          self.act_status,
          self.delaytime      
        ]];
      };

      //time out player bet finish    
})();

//发完牌后的延迟处理
(function(){
  pro.delay_DealCard = function(){
      var self = this;

      self.act_status = AS_DELAY_COMPARE_CARD;   
      self.delaytime=1;   

      if(self.first_seat == self.banker_seat)
          self.first_seat = self.getNextSeatBySeat(self.first_seat);
     //仅设置状态          
     
      //dalay compare card
  };
  // 
})();

//  延迟后 比牌
//
(function(){
  
    pro.delay_ComepareCard = function(){
      var self = this;
      
      var player = self.getCompareUser(self.first_seat);
      var banker = self.getUserBySeat(self.banker_seat); 
     
      //是否全部比完
      if(player == null){ //是         
          self.act_status = AS_WAIT_FOR_NEXT_ROUND;

          //console.log(self.result);
          //插入未下注钓鱼数据    
          // var score =0;
          
           for(let i of _.values(self._users)){
               //if(i.opts.bet[1] ==0 && i.opts.bet[2] ==0 && i.opts.bet[3] ==0 && i.opts.bet[4] ==0){
                    self.result.push({
                        id:i.id,
                        nick:i.nickname,     
                        seat:i.opts.seat,      
                        //gold:i.gold_count,
                        score_count:i.opts.score,
                        fund:i.opts.fund
                    }); 
             //  }
           } 

          //插入庄家数据
          // self.result.unshift({
          //   id:banker.id,
          //   nick:banker.nickname,   
          //   seat:banker.opts.seat,        
          //   //gold:banker.gold_count,
          //   score_count:banker.opts.score,
          //   fund:banker.opts.fund
          // }); 

         //console.log(self.result);
          //返回总结算结果
          self.delaytime=20;
          return [self.getUsers(),[
            self.act_status,
            self.delaytime,
            //结算信息
            self.result,
            self.curr_fund,
            self.hand_num
          ]];

         //wait for result
      }else{//否
          //console.log(player.nickname);

          var result = self.compareCard(player);  

          if( result >0 ){//'庄家赢'

              //扣除组局基金 5%
              var fund =0; 
              if(self.curr_fund-0 < self.fund-0){
                fund= Math.round(result*0.05);

                if(self.curr_fund + fund > self.fund)
                  fund = self.fund - self.curr_fund;

                self.curr_fund += fund;
              }  

              self.banker_bet += result-fund;
              banker.opts.score += result-fund;
              banker.opts.fund += fund;
              banker.opts.fund_count+= fund;

              player.opts.score -= result;
              player.opts.bet[self.first_seat]=0;                    

              self.delaytime=5;
              //发送比牌结果
              return [self.getUsers(),[
                  self.act_status,
                  self.delaytime,
                  [ self.banker_bet,
                    result,
                    banker.opts.seat,
                    player.opts.seat,
                    self.first_seat,
                    player.id]  ]];
              //delay  compare card  5s（下一个玩家，包含钓鱼者）
          }else{//庄家输
              if( self.banker_bet + result >0   ){ //够赔
                 
                  //扣除组局基金
                  var fund =0; 
                  if(self.curr_fund-0 < self.fund-0){
                    fund= Math.round(-result*0.05);

                    if(self.curr_fund + fund > self.fund)
                        fund = self.fund - self.curr_fund;

                    self.curr_fund += fund;
                  }                 

                  self.banker_bet += result;                 
                  banker.opts.score += result;

                  player.opts.score -= result-fund;
                  player.opts.fund += fund;
                  player.opts.fund_count += fund;
                  player.opts.bet[self.first_seat] = 0;    
                     
                  self.delaytime=5;
                  //发送比牌结果
                  return [self.getUsers(),[
                    self.act_status,
                    self.delaytime,
                   [ self.banker_bet,
                    result,
                    banker.opts.seat,
                    player.opts.seat,
                    self.first_seat,
                    player.id]  ]];
                  
                  //delay compare card 5s（继续下一家
              }else{//不够赔
                  
                  //扣除组局基金                  
                  var fund =0; 
                  if(self.curr_fund-0 < self.fund-0){
                    fund= Math.round(self.banker_bet*0.05);

                    if(self.curr_fund + fund > self.fund)
                      fund = self.fund - self.curr_fund;

                    self.curr_fund += fund;
                  }   

                  var score = self.banker_bet;
                  banker.opts.score -= self.banker_bet;
                  player.opts.score += score-fund;
                  player.opts.fund += fund;
                  player.opts.fund_count += fund;
                  player.opts.bet[self.first_seat] -= self.banker_bet;
                  self.banker_bet =0;
                  //player.opts.checkout = result[1];

                  //是否有续庄资 格
                  if( self.chips.length > 0 ){//有
                    //先结算目前
                    self.act_status = AS_DELAY_COMPARE_CARD2;

                    self.delaytime=5;
                     //发送比牌结果

                    return [self.getUsers(),[
                      self.act_status,
                      self.delaytime,
                      [ self.banker_bet,
                        -score,
                        banker.opts.seat,
                        player.opts.seat,
                        self.first_seat,
                        player.id]  ]];                
                    //DELAY COMPARE CARD 2  5S
                  }else{//无 
                       //先结算目前                      
                      self.act_status = AS_DELAY_COMPARE_CARD3;
                     
                      self.delaytime=5;
                      //发送比牌结果
                      return [self.getUsers(),[
                        self.act_status,
                        self.delaytime,
                        [ self.banker_bet,
                          -score,
                          banker.opts.seat,
                          player.opts.seat,
                          self.first_seat,
                          player.id]  ]];    
                        
                       //DELAY COMPARE CARD 3  5S                                       
                  }
              }
          }
      }           
    }; 

  //   function AddResult(result,that){   
  //       //先查找结果中是否已有此人
  //       var isnew  = true;
  //       for(let r of _.values(that.result)){
  //         if(r.id == result.id){

  //               r.score_count += result.score_count;
  //               r.fund += result.fund;

  //               isnew = false;
  //               break;
  //         }
  //       }
  //       //若没有，则追加
  //       if(isnew)
  //         that.result.push(result);
        
  //   }

  //   //console.log('rest round');
  // };


  })();


//庄家不足赔付时 先结算当前的部分延迟后的处理
  (function(){
    pro.delay_ComepareCard2 = function(){
      var self = this;    
      
        self.act_status = AS_WAIT_FOR_BANKER_CONTINUE_BET; 
        self.delaytime=20;

        return [self.getUsers(),[
          self.act_status,
          self.delaytime,
          self.banker_seat
          ]];                   
  
        //WAIT FOR BANKER CONTINUE BET     20S
    };
    // 
  })();

  //庄家不足赔付时 先结算当前的部分然后下庄结算  延迟后的处理
  (function(){
    pro.delay_ComepareCard3 = function(){
      var self = this;    
      
        self.act_status = AS_WAIT_FOR_NEXT_ROUND2;      //开始后不再询问是否续庄，

        var banker = self.getUserBySeat(self.banker_seat);
        //回合结算
         //插入未下注钓鱼数据    并扣除元宝
          // var score =0;
         
          for(let i of _.values(self._users)){
            //if(i.opts.bet[1] ==0 && i.opts.bet[2] ==0 && i.opts.bet[3] ==0 && i.opts.bet[4] ==0){
                 self.result.push({
                       id:i.id,
                       nick:i.nickname,  
                       seat:i.opts.seat,         
                       //gold:i.gold_count,
                       score_count:i.opts.score,
                       fund:i.opts.fund
                 }); 
           // }
        } 

       // //插入庄家数据
       // self.result.unshift({
       //  id:banker.id,
       //   nick:banker.nickname,   
       //   seat:banker.opts.seat,        
       //   //gold:banker.gold_count,
       //   score_count:banker.opts.score,
       //   fund:banker.opts.fund
       // }); 

       self.delaytime=20;
        return [self.getUsers(),[
          self.act_status,
          self.delaytime,
        //结算信息
          self.result,
          self.curr_fund,
          self.hand_num
          ]]; 
                
        //WAIT FOR BANKER CONTINUE BET     20S
    };
    // 
  })();

  //庄家续庄后的延迟处理
  (function(){
    pro.delay_BankerContinueBet = function(){
      var self = this;    

        self.act_status = AS_DELAY_COMPARE_CARD;

        if(self.banker_bet==0){//为0 为选择下庄，清空可用筹码
            while(self.chips.length>0)
                self.chips.shift();
        }           

        self.delaytime =3;
        //仅设置状态          
        return self.act_status;
        //dalay compare card     5S
    };
    // 
  })();

  (function(){
    pro.delay_NextRound = function(){
        var self = this;    
       
        switch(self.specialflag){
          case AS_WAIT_FOR_BANKER_BET://强制下庄模式 直接设下家为庄
              self._cards_36  = genCards();
              restRound.call(self,self);
              
              self.banker_seat = self.getNextSeatBySeat(self.banker_seat);
              self.banker_bet=0;
              self.round_num++;
              self.chips = [2000,3000,5000];

              self.act_status = AS_WAIT_FOR_BANKER_BET;
              self.delaytime=15;

              return [self.getUsers(),[
                self.act_status,
                self.delaytime,
                self.banker_seat,        
              ]];
          break;

          case AS_WAIT_FOR_BANKER_CONTINUE://正常结束，询问是否续庄
                self._cards_36  = genCards();
                restRound.call(self,self);

                self.act_status = AS_WAIT_FOR_BANKER_CONTINUE;
                self.act_seat = self.banker_seat;

                self.delaytime=20;

                return [self.getUsers(),
                        [ self.act_status,
                          self.delaytime,
                          self.act_seat
                        ]];  
          break;

         // case AS_WAIT_FOR_BANKER_CONTINUE_DICE://结束一把，庄家继续打色子
          case AS_WAIT_FOR_PLAYER_BET://结束一把，闲家 下注
              restHand.call(self,self);
              self.act_status = AS_WAIT_FOR_PLAYER_BET;
              self.act_seat = self.banker_seat;

               self.delaytime=20;

                return [self.getUsers(),
                      [ self.act_status,
                        self.delaytime,
                        self.act_seat 
                      ]];    
          break;
          } 
      };

       function restHand( that ){   
    
        that.hand_num++;

        that.first_seat   = that.banker_seat;
        that.act_seat = that.banker_seat;//911
        that.result.length= 0;            //911

        for( let i of _.values(that.getUsers())){
            i.opts.fund =0;
            if(i.opts.seat == that.banker_seat)
                continue;
            i.opts.bet = [0,0,0,0,0];                
        }

        //console.log('rest hand');
      };

  function restRound(that){
   
    that.hand_num =1;
   
    that.first_seat   = that.banker_seat;
    that.act_seat = that.banker_seat;
    that.result.length= 0;  

    for( let i of _.values(that.getUsers())){
      i.opts.fund =0;
      if(i.opts.seat == that.banker_seat)
          continue;

      i.opts.bet = [0,0,0,0,0];           
    }

    //console.log('rest round');
  };

  })();

//----------------等待超时处理部分-------------------------
//
//
//  /**
// 超时玩家打色子
(function(){

  pro.timeOut_PlayerDice = function(){
    var self = this;
    return self.craps4(self.getUserBySeat(self.act_seat).id);
  };  
})();


// 超时  庄家下锅底
(function(){
  pro.timeOut_BankerBet = function(){
      var self = this;
      for(let i of _.values(this._players)){
          if(i.opts.seat == self.banker_seat){
            //查询可用的最小锅底
            return self.bankerBet(i.id,2000);
            //return self.act_status;
          }
      }    
  };  
})();

//  
//超时  庄家打色子

(function(){

  pro.timeOut_BankerDice = function(){
    var self = this;

    //console.log(123321)

    for(let i of _.values(this._players)){
      if(i.opts.seat == self.banker_seat){       
        return self.bankerDice(i.id);
        //return self.act_status;
      }
    }      
  };
  
})();


(function(){
  /**
   * 非庄 玩家下注结束   * 
   * 
   */
  pro.timeOut_PlayerBet_Finish = function(){
      var self = this;
      
      var playersbet =[];
      for(let i of _.values(this._users)){
        if( i.opts.seat == self.banker_seat)
          continue;

        if( self.isPlayer(i) ){

          //在座玩家下最小注   
          if(i.opts.bet[i.opts.seat]==0)       
            i.opts.bet[i.opts.seat] =100;
          
          playersbet.push([i.id,i.opts.bet]);

        }else{
            //钓鱼玩家不下注
            // if(i.opts.bet)
            playersbet.push([i.id,i.opts.bet]);
        }
      }

      self.act_status = AS_DELAY_PLAYER_BET;
      self.delaytime=3;

      return [self.getUsers(),[
        self.act_status, 
        self.delaytime,
        playersbet                 
      ]];

      //delay player bet 5s
  };  
})();



//庄家超时自动续庄
(function(){

  pro.timeOut_Banker_Continue_Bet =  function(){
    //自动返回庄家续庄数  默认下庄
    var self = this;

    for(let i of _.values(this._players)){
      if(i.opts.seat == self.banker_seat ){       
          return self.banker_Continue_Bet(i.id,0);
          //return self.act_status;;
      }
    }
  };

})();

(function(){

  pro.timeOut_Next_Round = function(type){
    var self = this;

    //检查是否有座位的人掉线
    var online_count = self.getReadyCount();
    for(let p  of _.values(self._players)){
      if( p.opts.is_quit == 1)
        online_count--;
    }

    //取得已准备人数
    if(online_count <4){
         //取得总人数
         // if(self.getUserCount()<4){//有人退出
         //    //总人数够，钓鱼者补位

         // }else{
            //人数不足，结算游戏
            //总结算表
            self.act_status = AS_GAMEOVER;
            var result=[];
            for(let u of _.values(self.getUsers()) ) {
                u.opts.is_ready =0;
                result.push({
                  id:u.id,
                  nick:u.nickname,
                  seat:u.opts.seat,
                  //gold:u.gold_count,
                  score:u.opts.score,
                  fund:u.opts.fund_count,
                });
            }

            self.delaytime=1;

            return [self.getUsers(),
                      [ self.act_status,
                        self.delaytime,
                        result
                      ]];
        // }
    }
   


    // if(self.round_num >= self.round_count*4){
    //   self.act_status = AS_GAMEOVER;
    //   //console.log('-------------');
    //   // console.log(self);

    //   //总结算表
    //   var result=[];
    //   for(let u of _.values(self.getUsers()) ) {
    //       u.opts.is_ready =0;
    //       result.push({
    //         id:u.id,
    //         nick:u.nickname,
    //         seat:u.opts.seat,
    //         gold:u.gold_count,
    //         score:u.opts.score,
    //       });
    //   }

    //   self.delaytime=0;
    //   return [self.getUsers(),
    //             [ self.act_status,
    //               self.delaytime,
    //               result
    //             ]]; 
    // }

    self.act_status = AS_DELAY_NEXT_ROUND;//用于重置游戏
    self.delaytime = 1;
    
    self.specialflag=AS_WAIT_FOR_PLAYER_BET;
    if(self.hand_num == 4 || type==2)
      if(type==2){

        //已打够指定圈数
        if(self.round_num >= self.round_count*4){
            self.act_status = AS_GAMEOVER;

            //总结算表
            var result=[];
            for(let u of _.values(self.getUsers()) ) {
                u.opts.is_ready =0;
                result.push({
                  id:u.id,
                  nick:u.nickname,
                  seat:u.opts.seat,
                  //gold:u.gold_count,
                  score:u.opts.score,
                  fund:u.opts.fund_count,
                });
            }

            self.delaytime=0;
            return [self.getUsers(),
                      [ self.act_status,
                        self.delaytime,
                        result
                      ]]; 
          }

          self.specialflag=AS_WAIT_FOR_BANKER_BET;//强制下庄
        }else
          self.specialflag=AS_WAIT_FOR_BANKER_CONTINUE;//庄家续庄

    return[     self.getUsers(),
                [ self.act_status,
                  self.delaytime,
                  self.round_num,
                  self.hand_num,
                  self.specialflag,
                ]];
  };
 
})();

(function(){

  pro.timeOut_Banker_Continue = function(){
    var self = this;
    for(let i of _.values(this._players)){
      if(i.opts.seat == self.banker_seat ){       
          return self.banker_Continue(i.id,false);          
      }
    }
  };

})();

(function(){

  pro.gameOver = function(){
    var self = this;
    self.act_status = 'QUIT';
    for(let i of _.values(self._users)){
      i.opts.is_ready =0 ;      
    }
  };

})();


//---------算法--------------
function checkout(banker, player){
  //var result = 0;
 
  if(player.point > banker.point){  // 玩家点数大于庄家
   
      if(player.point > 10)
        return -2*player.bet;
      else
        return -player.bet;
     
  }else{  
      return player.bet;   
  }

  //return result;
};
// function checkout(banker, player){
//   var result = [0, 0, 0];
 
//   if(player.point > banker.point){  // 玩家点数大于庄家
//     if(player.point > 10){          // 是否为对
//       if(player.gold > 0){    // 是否有元宝
//         result[0] = -player.bet*2;
//         result[1] = player.bet*2;
//         result[2] = player.seat;
//       }
//     }else{
//       result[0] = -player.bet;
//       result[1] = player.bet;
//     }
//   }else{
//     if(banker.point > 10){
//       if(banker.gold > 0){ //是否有元宝
//         result[0] = player.bet;
//         result[1] = -player.bet;
//         result[2] = banker.seat;
//       }
//     }else{
//       result[0] = player.bet;
//       result[1] = -player.bet;
//     }
//   }

//   return result;
// };