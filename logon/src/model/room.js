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

const ACT_STATUS_READY  = 'ACT_STATUS_READY';

const ACT_STATUS_CRAPS4_BEFORE = 'ACT_STATUS_CRAPS4_BEFORE';
const ACT_STATUS_CRAPS4        = 'ACT_STATUS_CRAPS4';
const ACT_STATUS_CRAPS4_AFTER  = 'ACT_STATUS_CRAPS4_AFTER';

const ACT_STATUS_BANKER_BET_BEFORE = 'ACT_STATUS_BANKER_BET_BEFORE';
const ACT_STATUS_BANKER_BET        = 'ACT_STATUS_BANKER_BET';
const ACT_STATUS_BANKER_BET_AFTER  = 'ACT_STATUS_BANKER_BET_AFTER';

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
  self. act_status    = ACT_STATUS_READY;
  self._act_direction = DIRECTION_CLOCKWISE;

  self._free_seat    = [1, 2, 3, 4];
  self._player_count = self._free_seat.length;

  self.visitor_count = opts.visitor_count || 0;  // 游客人数
  self.fund          = opts.fund          || 1000;
  self.round_count   = opts.round_count   || 4;
};

var pro = Method.prototype;

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
 *
 * @return
 */
pro.getUserBySeat = function(seat_no){
  return this._players[seat_no];
};

/**
 * 获取所有用户
 *
 * @return
 */
pro.getUsers = function(){
  return this._users;
};

/**
 * 判断是否是
 *
 * @return
 */
pro.isPlayer = function(user_id){
  var user = this.getUser(user_id);
  if(!user) return;
  return 0 < user.opts.seat;
};

/**
 *
 * @return
 */
pro.isReady = function(user_id){
  var user = this.getUser(user_id);
  if(!user) return;
  return 0 < user.opts.is_ready;
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
    if(0 < i.opts.is_ready) ++count;
  }

  return count;
};

/**
 *
 * @return
 */
pro.release = function(){
  return 1 > _.size(this._users);
};

/**
 * 房间满了吗？
 *
 * @return boolean
 */
pro.isFull = function(){
  return (this._player_count + this.visitor_count) <= _.size(this._users);
};

(function(){
  /**
   * 进入群组
   *
   * @return
   */
  pro.entry = function(user){
    var self = this;

    if(self.getUser(user.id)) return '已经在房间内';
    if(self.isFull())         return '房间满员';

    user.opts = {};

    setSeat.call(self, user);

    self._users[user.id] = user;

    user.opts.entry_time = new Date().getTime();
    user.opts.score      = 0;
    user.opts.is_quit    = 0;
    user.opts.is_ready   = 0;

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
  var _user = this.getUser(user.id);
  if(!_user)                   return;
  if(!this.isPlayer(_user.id)) return;
  if(1 > _user.opts.is_quit)   return;

  _user.opts.re_entry_time = new Date().getTime();
  _user.opts.is_quit       = 1;

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

  var user = self.getUser(user_id);
  if(!user) return true;

  if(self.isStart() && self.isPlayer(user_id)){
    user.opts.quit_time = new Date().getTime();
    user.opts.is_quit   = 1;
    return false;
  }

  if(self.isPlayer(user_id)){
    self._free_seat.push(user.opts.seat);
    delete self._players[user.opts.seat];
  }

  return (delete self._users[user_id]);
};

/**
 *
 * @return
 */
pro.ready = function(user_id){
  var self = this;

  if(self.act_status !== ACT_STATUS_READY) return '动作：举手';
  if(self.isStart())                       return '已经开始';

  var user = self.getUser(user_id);
  if(!user)                   return '用户不存在';
  if(!self.isPlayer(user_id)) return '不能举手';
  if( self.isReady (user_id)) return '已经举手';

  user.opts.is_ready = 1;

  if(self.isStart()){
    self.act_status = ACT_STATUS_CRAPS4;
    self.act_seat   = self.banker_seat || 1;
    self._cards_36  = genCards();
  }

  return user;
};

(function(){
  /**
   *
   * @return
   */
  pro.craps4 = function(user_id){
    var self = this;

    if(self.act_status !== ACT_STATUS_CRAPS4) return 'ACT_STATUS_CRAPS4';

    var user = self.getUser(user_id);
    if(!user)                            return '用户不存在';
    if(self.act_seat !== user.opts.seat) return '还没轮到你';
    if(user.opts.craps)                  return 'craps';

    user.opts.craps = [ _.random(1, 6), _.random(1, 6) ];

    if(self._player_count <= getCrapsCount.call(self)){
      self.act_status  = ACT_STATUS_CRAPS4_AFTER;
      self.banker_bets = [200, 300, 500];
      self.banker_seat = maxCraps.call(self);
      self.act_seat    = self.banker_seat;
    }else{
      self.act_seat = self.getNextSeatBySeat(self.act_seat);
    }

    return user;
  };

  /**
   *
   * @return
   */
  pro.craps4_after = function(){
    var self = this;
    if(self.act_status !== ACT_STATUS_CRAPS4_AFTER) return 'ACT_STATUS_CRAPS4_AFTER';
    self.act_status = ACT_STATUS_BANKER_BET_BEFORE;
    return self;
  }

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

/**
 *
 * @return
 */
pro.bankerBet = function(user_id, bet){
  var self = this;
};

(function(){
  /**
   *
   * @return
   */
  pro.bankerCraps = function(user_id){
    var self = this;
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

(function(){
  /**
   *
   * @param bet '1,100'
   * @return
   */
  pro.unBankerBet = function(user_id, bet){
    var self = this;
  };

  function getBet(bet){
    return bet;
  }
})();

(function(){
  /**
   *
   * @return
   */
  pro.compareCard = function(){
    var self = this;
  };

  function getPoint(seat){
    var self = this;

    var c1 = self._cards_8[(seat - 1) * 2];
    var c2 = self._cards_8[(seat - 1) * 2 + 1];

    return (c1 !== c2) ? ((c1 + c2) % 10) : (10 + c1);
  }

  function getCompareSeat(){
    var self = this;
  }
})();

/**
 *
 * @return
 */
pro.bankerGoOn = function(){
  var self = this;
};
