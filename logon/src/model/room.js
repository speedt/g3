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

const uuid = require('node-uuid');

const utils = require('speedt-utils').utils;

const cfg = require('emag.cfg');
const biz = require('emag.biz');

const _  = require('underscore');
_.str    = require('underscore.string');
_.mixin(_.str.exports());

const logger = require('log4js').getLogger('model.room');

const DIRECTION_CLOCKWISE     = 1;  // 顺时针
const DIRECTION_ANTICLOCKWISE = 0;  // 逆时针

const ACT_STATUS_DEFAULT = 0;  // 动作状态：默认

module.exports = function(opts){
  return new Method(opts);
}

var Method = function(opts){
  opts                = opts || {};
  var self            = this;
  self.opts           = opts;
  self.id             = opts.id;
  self.name           = opts.name || ('Room '+ opts.id);

  self.users          = {};
  self.players        = {};

  self.visitor_count  = opts.visitor_count || 6;  // 游客人数
  self.player_count   = opts.player_count  || 4;  // 玩家人数

  self.extend_data    = {};

  self.create_user_id = opts.user_id;
  self.create_time    = new Date().getTime();

  self.act_user_seat  = 1;
  self.act_status     = ACT_STATUS_DEFAULT;
  self.act_direction  = DIRECTION_CLOCKWISE;

  self.ready_count    = 0;  // 举手人数
};

var pro = Method.prototype;

/**
 * 创建空闲的座位
 *
 * @return
 */
function genFreeSeat(){
  this.free_seats = [];
  for(var i = 1; i <= 4; i++){
    this.free_seats.push(i);
  }
}

pro.init = function(){
  var self                 = this;
  genFreeSeat.call(self);

  var opts                 = self.extend_data;
  opts.id                  = utils.replaceAll(uuid.v4(), '-', '');
  opts.fund                = self.opts.fund        || 1000;  // 组局基金
  opts.round_count         = self.opts.round_count || 4;     // 圈数
  opts.round_pno           = 1;  // 当前第n局
  opts.round_no            = 1;  // 当前第n把
  opts.round_no_first_seat = 1;
  opts.banker_seat         = 1;  // 当前庄家座位
};

/**
 *
 * @return
 */
pro.release = function(){
  return true;
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
 * 房间满了吗？
 *
 * @return boolean
 */
pro.isFull = function(){
  return (this.player_count + this.visitor_count) < _.size(this.users)
};

/**
 *
 * @return
 */
pro.entry = function(user_info){
  assert.notEqual(null, user_info);
  assert.notEqual(null, user_info.id);

  var self = this;

  if(self.getUser(user_info.id)) return Promise.reject('已经在房间内');
  if(self.isFull()) return Promise.reject('房间满员');

  var seat_no = self.free_seats.shift();

  if(seat_no){
    self.players[seat_no] = user_info.id;
    user_info._seat       = seat_no;
  }

  // 进入房间时间
  user_info._entry_time = new Date().getTime();

  self.users[user_info.id] = user_info;

  return Promise.resolve(user_info);
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
