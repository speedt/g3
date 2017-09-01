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
const ACT_STATUS_NEXT    = 1;  // 动作状态：

module.exports = function(opts){
  return new Method(opts);
}

var Method = function(opts){
  assert.notEqual(null, opts);
  assert.notEqual(null, opts.id);

  var self                 = this;
  self.opts                = opts;

  self.id                  = opts.id;
  self.name                = opts.name || ('Room '+ opts.id);

  self.users               = {};
  self.players             = {};

  self.visitor_count       = opts.visitor_count || 6;  // 游客人数
  self.player_count        = opts.player_count  || 4;  // 玩家人数

  self.create_user_id      = opts.user_id;
  self.create_time         = new Date().getTime();

  self.act_seat            = 1;
  self.act_status          = ACT_STATUS_DEFAULT;
  self.act_direction       = DIRECTION_CLOCKWISE;

  self.ready_count         = 0;  // 举手人数

  self.round_id            = utils.replaceAll(uuid.v4(), '-', '');
  self.fund                = opts.fund        || 1000;  // 组局基金
  self.round_count         = opts.round_count || 4;     // 圈数
  self.round_pno           = 1;  // 当前第n局
  self.round_no            = 1;  // 当前第n把
  self.round_no_first_seat = 1;
  self.banker_seat         = 1;  // 当前庄家座位

  // 创建空闲的座位
  self.free_seats = [];
  for(var i = 1; i <= self.player_count; i++){
    self.free_seats.push(i);
  }
};

var pro = Method.prototype;

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

  user_info.opts = {};

  var seat_no = self.free_seats.shift();

  if(seat_no){
    self.players[seat_no] = user_info.id;
    user_info.opts.seat   = seat_no;
  }

  // 进入房间时间
  user_info.opts.entry_time = new Date().getTime();

  self.users[user_info.id] = user_info;

  return Promise.resolve(user_info);
};

/**
 *
 * @return
 */
pro.reEntry = function(user_info){
  assert.notEqual(null, user_info);

  var user = this.getUser(user_info.id);
  if(!user) return;

  user.server_id         = user_info.server_id;
  user.channel_id        = user_info.channel_id;
  user.opts.reEntry_time = new Date().getTime();

  if(0 < user.opts.seat) user.opts.is_quit = 0;
}

/**
 *
 * @return
 */
pro.quit = function(user_id){
  var self = this;

  var user = self.getUser(user_id);
  if(!user) return true;

  if((self.player_count <= self.ready_count) && (0 < user.opts.seat)){
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
  assert.notEqual(null, user_id);

  var self = this;

  if(self.act_status !== ACT_STATUS_DEFAULT) return;

  if(self.isStart()) return;

  var user = self.getUser(user_id);
  if(!user) return;

  if(0 === user.opts.seat)         return;
  if(1 === user.opts.ready_status) return;

  user.opts.ready_status = 1;
  user.opts.ready_time   = new Date().getTime();

  self.ready_count++;

  if(isStart()) self.act_status = ACT_STATUS_NEXT;

  return self.ready_count;
};

/**
 * 判断是否游戏是否开始
 *
 * @return
 */
pro.isStart = function(){
  return self.player_count <= self.ready_count;
};
