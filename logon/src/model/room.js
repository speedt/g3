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

const ACT_STATUS_INIT         = 0;  // 动作状态：初始化
const ACT_STATUS_CRAPS4       = 1;  // 动作状态：摇骰子
const ACT_STATUS_BANKER_BET   = 2;  // 动作状态：庄家设置锅底
const ACT_STATUS_BANKER_CRAPS = 3;  // 动作状态：庄家摇骰子，确定谁先起牌
const ACT_STATUS_UNBANKER_BET = 4;  // 动作状态：闲家下注
const ACT_STATUS_CARD_COMPARE = 5;  // 动作状态：庄家 比大小 闲家 钓鱼
const ACT_STATUS_BANKER_DOWN  = 6;  // 动作状态：庄家下庄
const ACT_STATUS_BANKER_GO_ON = 7;  // 动作状态：续庄问询

module.exports = function(opts){
  return new Method(opts);
}

var Method = function(opts){
  var self                   = this;
  self.opts                  = opts;

  self.id                    = opts.id;
  self.name                  = opts.name || ('Room '+ opts.id);

  self.users                 = {};  // 全部用户
  self.players               = {};  // 玩家列表

  self.player_count          = 4;  // 玩家人数

  self.create_user_id        = opts.user_id;
  self.create_time           = new Date().getTime();

  self.act_seat              = 1;
  self.act_status            = ACT_STATUS_INIT;
  self.act_direction         = DIRECTION_CLOCKWISE;

  self.ready_count           = 0;  // 举手人数
  self.ready                 = []; // 整个房间举手的座位号

  self.round_id              = utils.replaceAll(uuid.v4(), '-', '');
  self.round_pno             = 1;  // 当前第n局
  self.round_no              = 1;  // 当前第n把
  self.round_no_first_seat   = 1;  // 庄家摇骰子确定第一个起牌的人
  self.round_no_compare      = []; // 牌比对结果
  self.round_no_compare_seat = 1;  // 当前比较牌大小的人的位置
  self.round_no_ready        = []; // 每局举手的座位号

  self.banker_seat           = 0;               // 当前庄家座位
  self.banker_bets           = [200, 300, 500]; // 庄家锅底

  self.visitor_count         = opts.visitor_count || 0;     // 游客人数
  self.fund                  = opts.fund          || 1000;  // 组局基金
  self.round_count           = opts.round_count   || 4;     // 圈数

  // 创建空闲的座位
  self.free_seats = [];
  for(var i = 1; i <= self.player_count; i++){
    self.free_seats.push(i);
  }
};

var pro = Method.prototype;

/**
 * 生成36张牌
 *
 * @return
 */
function genCards(num){
  num = num || 36;

  var cards = [];
  var p = 1;

  for(let i = 0; i < num; i += 4){
    cards[i] = cards[i + 1] = cards[i + 2] = cards[i + 3] = p++;
  }

  var max = num - 1;

  for(let i = 0; i < num; i++){
    let r = Math.round(Math.random() * max);
    p = cards[r];
    cards[r] = cards[max];
    cards[max--] = p;
  }

  return cards;
}

/**
 * 获取8张牌
 *
 * @return
 */
function getCards(num, user_id){
  num = num || 8;
  var arr = [];

  for(let i = 0; i < num; i++){
    arr.push(this.cards_36.shift());
  }

  return arr;
}

/**
 * 获取当前下注的人数
 *
 * @return
 */
pro.getBetSeatCount = function(){
  var bet_count = 0;

  for(let i of _.values(this.users)){
    if(0 < i.opts.bet) ++bet_count;
  }

  return bet_count;
};


/**
 * 判断是否游戏是否开始
 *
 * @return
 */
pro.isStart = function(){
  return this.player_count <= this.ready_count;
};

/**
 *
 * @return
 */
pro.release = function(){
  return 1 > _.size(this.users);
};

/**
 * 获取用户
 *
 * @param id 用户id
 * @return
 */
pro.getUser = function(id){
  return this.users[id];
};

/**
 * 获取用户
 *
 * @param seat_no
 * @return
 */
pro.getUserBySeat = function(seat_no){
  var user_id = this.players[seat_no];
  if(!user_id) return;
  return this.getUser(user_id);
}

/**
 * 获取用户上家
 *
 * @param user_id
 * @return
 */
pro.getUserPrev = function(user_id){
  var user = this.getUser(user_id);
  if(!user) return;
  if(0 < user.opts.seat) return;

  return this.getUserPrevBySeat(user.opts.seat);
};

/**
 * 获取用户下家
 *
 * @param user_id
 * @return
 */
pro.getUserNext = function(user_id){
  var user = this.getUser(user_id);
  if(!user) return;
  if(0 < user.opts.seat) return;

  return this.getUserNextBySeat(user.opts.seat);
};

/**
 * 获取用户上家
 *
 * @param seat_no
 * @return
 */
pro.getUserPrevBySeat = function(seat_no){
  return this.getUserBySeat(this.getSeatPrevBySeat(seat_no));
};

/**
 * 获取用户上家
 *
 * @param seat_no
 * @return
 */
pro.getSeatPrevBySeat = function(seat_no){
  seat_no -= 0;

  assert.equal(true, (0 < seat_no && seat_no <= this.player_count));

  return (1 > (--seat_no)) ? this.player_count : seat_no;
};

/**
 * 获取用户下家
 *
 * @param seat_no
 * @return
 */
pro.getUserNextBySeat = function(seat_no){
  return this.getUserBySeat(this.getSeatNextBySeat(seat_no));
};

/**
 * 获取用户下家
 *
 * @param seat_no
 * @return
 */
pro.getSeatNextBySeat = function(seat_no){
  seat_no -= 0;

  assert.equal(true, (0 < seat_no && seat_no <= this.player_count));

  return (this.player_count < (++seat_no)) ? 1 : seat_no;
};

/**
 * 房间满了吗？
 *
 * @return boolean
 */
pro.isFull = function(){
  return (this.player_count + this.visitor_count) <= _.size(this.users)
};

/**
 *
 * @return
 */
pro.entry = function(user_info){
  var self = this;

  if(self.getUser(user_info.id)) return;  // 已经在房间内
  if(self.isFull())              return;  // 房间满员

  user_info.opts = {};

  var seat_no = self.free_seats.shift();

  if(seat_no){
    self.players[seat_no] = user_info.id;
    user_info.opts.seat   = seat_no;
  }

  // 进入房间时间
  user_info.opts.entry_time = new Date().getTime();

  self.users[user_info.id] = user_info;

  return user_info;
};

/**
 * 离线时，玩家重新落座，恢复状态
 *
 * @return
 */
pro.reEntry = function(user_info){
  assert.notEqual(null, user_info);

  var user = this.getUser(user_info.id);
  if(!user) return;

  if(1 > user.opts.seat) return;

  user.server_id         = user_info.server_id;
  user.channel_id        = user_info.channel_id;

  user.opts.reEntry_time = new Date().getTime();
  user.opts.is_quit      = 0;

  return user;
}

/**
 *
 * @return
 */
pro.quit = function(user_id){
  var self = this;

  var user = self.getUser(user_id);
  if(!user) return true;

  if(self.isStart() && (0 < user.opts.seat)){
    user.opts.is_quit   = 1;
    user.opts.quit_time = new Date().getTime();
    return false;
  }

  if(0 < user.opts.seat){
    if(1 === user.opts.ready_status) --self.ready_count;
    self.free_seats.push(user.opts.seat);
    delete self.players[user.opts.seat];
  }

  delete self.users[user_id];
  return true;
};

/**
 * 玩家举手
 *
 * @return
 */
pro.ready = function(user_id){
  var self = this;

  if(self.act_status !== ACT_STATUS_INIT) return;

  if(self.isStart()) return;  // 已经开始

  var user = self.getUser(user_id);
  if(!user) return;  // 用户不存在

  if(1 > user.opts.seat)         return;  // 不能举手
  if(0 < user.opts.ready_status) return;  // 已经举手

  user.opts.ready_status = 1;
  user.opts.ready_time   = new Date().getTime();
  user.opts.score        = 0;

  self.ready_count++;

  if(self.isStart()){
    self.act_status = ACT_STATUS_CRAPS4;
    self.act_seat   = 1;
    self.cards_36   = genCards();
  }

  return user;
};

(() => {
  /**
   * 4人摇骰子
   *
   * @return
   */
  pro.craps4 = function(user_id){
    var self = this;

    if(self.act_status !== ACT_STATUS_CRAPS4) return;

    var user = self.getUser(user_id);
    if(!user) return;
    if(self.act_seat !== user.opts.seat) return;  // 还没轮到你

    if(user.opts.craps) return;  // 你已经摇过骰子了

    user.opts.craps = [
      _.random(1, 6),  // 骰子1
      _.random(1, 6),  // 骰子2
    ];

    if(self.player_count <= getCrapsCount.call(self)){
      // 计算最大的骰子，并设置庄家位置
      self.banker_seat = maxCraps.call(self);
      self.banker_bets = [200, 300, 500];
      self.act_status  = ACT_STATUS_BANKER_BET;
      self.act_seat    = self.banker_seat;
      return user;
    }

    self.act_seat++;

    return user;
  };

  /**
   * 获取摇过骰子的人数
   *
   * @return
   */
  function getCrapsCount(){
    var count = 0;

    for(let i of _.values(this.users)){
      if(i.opts.craps) count++;
    }

    return count;
  }

  /**
   * 计算最大的骰子
   *
   * @return 座位id
   */
  function maxCraps(){
    var max = 0, seat = 0;

    for(let i of _.values(this.users)){
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

(() => {
  /**
   * 庄家锅底
   *
   * @return
   */
  pro.bankerBet = function(user_id, bet, token){
    var self = this;

    if(self.act_status !== ACT_STATUS_BANKER_BET) return;

    var user = self.getUser(user_id);
    if(!user)                            return;
    if(self.act_seat !== user.opts.seat) return;  // 还没轮到你

    self.act_status  = ACT_STATUS_BANKER_CRAPS;

    clearAll.call(self);

    user.opts.bet = getBet.call(self, bet);

    if(!user.opts.bet) return;

    return user;
  };

  /**
   * 获取庄家的锅底
   *
   * @return
   */
  function getBet(bet){
    var self = this;

    if(1 > self.banker_bets.length) return;

    var _index = self.banker_bets.indexOf(bet);

    if(1 > _index) return self.banker_bets.shift();

    if(1 === _index) {
      self.banker_bets.shift();
      return self.banker_bets.shift();
    }

    if(2 === _index) {
      self.banker_bets.shift();
      self.banker_bets.shift();
      return self.banker_bets.shift();
    }

    return bet;
  }

  /**
   * 清理4个人的（骰子+注）
   *
   * @return
   */
  function clearAll(){
    for(let i of _.values(this.users)){
      delete i.opts.craps;  // 骰子
      delete i.opts.bet;    // 注
    }
  }
})();

(() => {
  /**
   * 动作状态：庄家摇骰子，确定谁先起牌
   *
   * @return
   */
  pro.bankerCraps = function(user_id){
    var self = this;

    if(self.act_status !== ACT_STATUS_BANKER_CRAPS) return;

    var user = self.getUser(user_id);
    if(!user)                            return;
    if(self.act_seat !== user.opts.seat) return;  // 还没轮到你

    self.act_status  = ACT_STATUS_UNBANKER_BET;

    user.opts.craps = [
      _.random(1, 6),  // 骰子1
      _.random(1, 6),  // 骰子2
    ];

    self.round_no_first_seat = firstSeat(user.opts.seat, user.opts.craps);

    self.act_seat = self.round_no_first_seat;

    return user;
  };

  /**
   * 第一个起牌的位置
   *
   * @return
   */
  function firstSeat(seat, craps){
    var n = craps[0] + craps[1];
    var m = (n - 1 + seat) % 4;

    return (0 === m) ? 4 : m;
  }
})();

(() => {
  /**
   * 动作状态：闲家下注
   *
   * @param bet '1,100|2,200'
   * @return
   */
  pro.unBankerBet = function(user_id, bet){
    var self = this;

    if(self.act_status !== ACT_STATUS_UNBANKER_BET) return;

    var user = self.getUser(user_id);
    if(!user) return;

    if(user.opts.bet) return;  // 下过注，则返回

    if(-1 === bet.indexOf(',')){
      bet -= 0;
      user.opts.bet = getBet.call(self, bet);
    }else{
      var arr = bet.split('|');

      if(!user.opts.bet) user.opts.bet = [];

      for(let i of arr){
        let _val = _.trim(i);

        if('' === _val) continue;

        let _key = _val.split(',');

        user.opts.bet.push([_key[0], getBet.call(self, _key[1])]);
      }
    }

    return user;
  };

  /**
   * 动作状态：闲家下注（关闭）
   *
   * @return
   */
  pro.unBankerBetClosure = function(round_no){
    var self = this;

    if(round_no !== self.round_no) return;

    if(self.act_status !== ACT_STATUS_UNBANKER_BET) return;

    self.act_status  = ACT_STATUS_CARD_COMPARE;

    self.cards_8 = getCards.call(self);

    return self.cards_8;
  };

  /**
   * 闲家下注
   *
   * @return
   */
  function getBet(bet){
    return bet;
  }
})();

(() => {
  /**
   * 动作状态：庄家 比大小 闲家
   *
   * @return
   */
  pro.cardCompare = function(){
    var self = this;

    if(self.act_status !== ACT_STATUS_CARD_COMPARE) return;
    self.act_status = ACT_STATUS_CARD_COMPARE_PAUSE;  // 暂停

    // 待比牌的闲家座位号
    self.round_no_compare_seat = getCompareSeat.call(self);

    // 进行下一把
    if(!self.round_no_compare_seat){
      self.act_status = ACT_STATUS_ROUND_NO_READY;  // 下一局准备开始
      self.round_no++;
      return '5028';
    }

    var   banker_user = self.getUserBySeat(self.banker_seat);
    var unbanker_user = self.getUserBySeat(self.round_no_compare_seat);

    var banker = {
      point:      getPoint.call(self, self.banker_seat),
      bet:        banker_user.opts.bet,
      seat:       self.banker_seat,
      gold_count: banker_user.gold_count - 0,
    };

    var unbanker = {
      point:      getPoint.call(self, self.round_no_compare_seat),
      bet:        unbanker_user.opts.bet,
      seat:       self.round_no_compare_seat,
      gold_count: unbanker_user.gold_count - 0,
    };

    // 比较结果
    var compare_result = checkout(banker, unbanker);

    if(0 < compare_result[2]){
      self.getUserBySeat(compare_result[2]).gold_count--;
    }

      banker_user.opts.score         += compare_result[0];
      banker_user.opts.score_original =   banker_user.opts.score;  // 原始
    unbanker_user.opts.score         += compare_result[1];
    unbanker_user.opts.score_original = unbanker_user.opts.score;  // 原始

    // 保存比较结果
    self.round_no_compare.push([[
      self.id,
      banker_user.id,
      self.round_id,
      self.round_pno,
      self.round_no,
      self.banker_seat,
      banker_user.gold_count,
      banker_user.opts.score,  // 实际赔付
    ], [
      self.id,
      unbanker_user.id,
      self.round_id,
      self.round_pno,
      self.round_no,
      self.round_no_compare_seat,
      unbanker_user.gold_count,
      unbanker_user.opts.score,  // 实际赔付
    ]]);

    if(1 > banker_user.opts.score){
      // 发送是否续庄问询
      self.act_status = ACT_STATUS_BANKER_GO_ON;
      self.token      = utils.replaceAll(uuid.v4(), '-', '');
      return '5024';
    }

    // 设置下一个比对的闲
    self.round_no_first_seat = self.getSeatNextBySeat(self.round_no_compare_seat);
    self.act_status          = ACT_STATUS_CARD_COMPARE;
    return '5026';
  };

  /**
   * 获取比较结果
   *
   * @return
   */
  function checkout(banker, unbanker){
    var result = [0, 0, 0];

    if(unbanker.point > banker.point){  // 玩家点数大于庄家
      if(unbanker.point > 10){          // 是否为对
        if(unbanker.gold_count > 0){    // 是否有元宝
          result[0] = -unbanker.bet;
          result[1] = unbanker.bet;
          result[2] = unbanker.seat;
        }
      }else{
        result[0] = -unbanker.bet;
        result[1] = unbanker.bet;
      }
    }else{
      if(banker.point > 10){
        if(banker.gold_count > 0){ //是否有元宝
          result[0] = unbanker.bet;
          result[1] = -unbanker.bet;
          result[2] = banker.seat;
        }
      }else{
        result[0] = unbanker.bet;
        result[1] = -unbanker.bet;
      }
    }

    return result;
  }

  /**
   * 获取庄家要比较的闲家的座位号
   *
   * @return
   */
  function getCompareSeat(){
    var self = this;

    var size = self.round_no_compare.length;
    if(2 < size) return;

    if(self.round_no_first_seat === self.banker_seat){

      self.round_no_first_seat++;

      if((self.player_count < self.round_no_first_seat)){
        self.round_no_first_seat = 1;
      }

      return self.round_no_first_seat;
    }

    return self.round_no_first_seat;
  }

  /**
   * 获取我的牌点数
   *
   * @return
   */
  function getPoint(seat){
    var self = this;

    var c1 = self.cards_8[(seat - 1) * 2];
    var c2 = self.cards_8[(seat - 1) * 2 + 1];

    return (c1 !== c2) ? ((c1 + c2) % 10) : (10 + c1);
  }
})();

/**
 * 4人举手，满足4人后，让庄摇骰子，确认谁先起牌
 *
 * @return
 */
pro.readyNext_1 = function(user_id, token){
  var self = this;

  if(self.token      !== token)                        return;
  if(self.act_status !== ACT_STATUS_READY_NEXT_1)      return;
  if(!self.isStart())                                  return;  // 没有开始

  var user = self.getUser(user_id);
  if(!user)                                            return;  // 用户不存在
  if( 1 > user.opts.seat)                              return;  // 不能举手
  if(-1 < self.round_no_ready.indexOf(user.opts.seat)) return;  // 已经举手

  self.round_no_ready.push(user.opts.seat);

  if(4 > self.round_no_ready.length) return user;

  self.act_status            = ACT_STATUS_BANKER_CRAPS;
  self.round_no_ready.length = 0;

  return user;
};

/**
 * 4人举手，满足4人后，下一家做庄，庄下锅底
 *
 * @return
 */
pro.readyNext_2 = function(user_id, token){
  var self = this;

  if(self.token      !== token)                        return;
  if(self.act_status !== ACT_STATUS_READY_NEXT_2)      return;
  if(!self.isStart())                                  return;  // 没有开始

  var user = self.getUser(user_id);
  if(!user)                                            return;  // 用户不存在
  if( 1 > user.opts.seat)                              return;  // 不能举手
  if(-1 < self.round_no_ready.indexOf(user.opts.seat)) return;  // 已经举手

  self.round_no_ready.push(user.opts.seat);

  if(4 > self.round_no_ready.length) return user;

  self.act_status            = ACT_STATUS_BANKER_BET;
  self.round_no_ready.length = 0;
  self.act_seat              = self.getSeatNextBySeat(self.banker_seat);
  self.banker_seat           = self.act_seat;

  return user;
};

/**
 * 庄家继庄
 *
 * @return
 */
pro.bankerGoOn = function(user_id, bet, token){
  var self = this;

  if(self.act_status !== ACT_STATUS_BANKER_GO_ON) return;
  self.act_status = ACT_STATUS_BANKER_GO_ON_PAUSE;

  var user = self.getUser(user_id);
  if(!user)                               return;
  if(self.banker_seat !== user.opts.seat) return;  // 你不是庄

  if(1 > bet){  // 先结算
    self.act_status  = ACT_STATUS_BANKER_BET;
    self.banker_bets = [200, 300, 500];
    self.banker_seat = self.getSeatNextBySeat(self.banker_seat);
    return '5030';
  }

  var bet = self.getBankBet(bet);

  if(!bet){
    self.act_status  = ACT_STATUS_BANKER_BET;
    self.banker_bets = [200, 300, 500];
    self.banker_seat = self.getSeatNextBySeat(self.banker_seat);
    return '5030';
  }

  user.opts.bet    = bet;
  user.opts.score += bet;

  if(1 > user.opts.score){
    // 发送是否续庄问询
    self.act_status = ACT_STATUS_BANKER_GO_ON;
    self.token      = utils.replaceAll(uuid.v4(), '-', '');
    return '5024';
  }

  return '5032';
};

/**
 * 获取庄家的锅底
 *
 * @return
 */
pro.getBankBet = function(bet){
  var self = this;

  if(1 > self.banker_bets.length) return;

  var _index = self.banker_bets.indexOf(bet);

  if(1 > _index) return self.banker_bets.shift();

  if(1 === _index) {
    self.banker_bets.shift();
    return self.banker_bets.shift();
  }

  if(2 === _index) {
    self.banker_bets.shift();
    self.banker_bets.shift();
    return self.banker_bets.shift();
  }
}
