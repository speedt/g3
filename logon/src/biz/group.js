/*!
 * emag.biz
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const path = require('path');
const cwd  = process.cwd();
const conf = require(path.join(cwd, 'settings'));

const uuid = require('node-uuid');

const md5   = require('speedt-utils').md5;
const utils = require('speedt-utils').utils;

const mysql = require('emag.db').mysql;
const redis = require('emag.db').redis;

const cfg = require('emag.cfg');
const biz = require('emag.biz');

const _  = require('underscore');
_.str    = require('underscore.string');
_.mixin(_.str.exports());

const roomPool = require('emag.model').roomPool;

const logger = require('log4js').getLogger('biz.group');

(() => {
  /**
   *
   * @return
   */
  exports.entry = function(server_id, channel_id, group_id){
    var room = roomPool.get(group_id);
    if(!room) return Promise.reject('房间不存在');

    return new Promise((resolve, reject) => {
      biz.user.getByChannelId(server_id, channel_id)
      .then(p1.bind(null, room))
      .then(biz.user.entryGroup)
      .then(p2.bind(null, room))
      .then(doc => resolve(doc))
      .catch(reject);
    });
  };

  function p1(room, user){
    if(user.group_id) return Promise.reject('MUST_BE_QUIT');
    user.group_id = room.id;
    return Promise.resolve(user);
  }

  function p2(room, user){
    var _entry = room.entry(user);
    if('string' === typeof _entry) return Promise.reject(_entry);

    var _users = [];

    for(let i of _.values(room.getUsers())){
      _users.push([i.id, i.opts.seat, i.nickname, i.weixin_avatar]);
    }

    return Promise.resolve([
      room.getUsers(),
      [
        [
          room.id,
          room.name,
          room.fund,
          room.round_count,
          room.visitor_count,        // 游客人数
          room.banker_seat,          // 当前庄家座位
          room.round_pno,            // 当前第n局
          room.round_no,             // 当前第n把
          room.round_no_first_seat,  // 庄家摇骰子确定第一个起牌的人
          room.getReadyCount(),      // 举手人数
          room.act_status,
          room.act_seat,
        ],
        _users,
      ]
    ]);
  }
})();

(() => {
  /**
   * 创建群组
   *
   * @return
   */
  exports.search = function(server_id, channel_id, group_info){
    group_info = group_info || {};

    if(!_.isNumber(group_info.visitor_count))
      return Promise.reject('INVALID_PARAMS');
    if(6 < group_info.visitor_count || 0 > group_info.visitor_count)
      return Promise.reject('INVALID_PARAMS');

    if(!_.isNumber(group_info.fund))
      return Promise.reject('INVALID_PARAMS');
    if(999999 < group_info.fund || 0 > group_info.fund)
      return Promise.reject('INVALID_PARAMS');

    if(!_.isNumber(group_info.round_count))
      return Promise.reject('INVALID_PARAMS');
    if(4 < group_info.round_count || 1 > group_info.round_count)
      return Promise.reject('INVALID_PARAMS');

    return new Promise((resolve, reject) => {
      biz.user.getByChannelId(server_id, channel_id)
      .then(p1)
      .then(p2.bind(null, group_info))
      .then(doc => resolve(doc))
      .catch(reject);
    });
  };

  function p1(user){
    if(user.group_id) return Promise.reject('MUST_BE_QUIT');

    return new Promise((resolve, reject) => {
      biz.user.genFreeGroupId()
      .then(group_id => {
        user.group_id = group_id;
        resolve(user);
      })
      .catch(reject);
    });
  }

  function p2(group_info, user){
    group_info.id             = user.group_id;
    group_info.create_user_id = user.id;

    return new Promise((resolve, reject) => {
      biz.user.createGroup(user)
      .then(p3.bind(null, group_info))
      .then(doc => resolve(doc))
      .catch(reject);
    });
  }

  function p3(group_info, user_info){

    logger.debug(group_info);

    var room = roomPool.create(group_info);
    if(!room) return Promise.reject('创建房间失败');

    var _entry = room.entry(user_info);
    if('string' === typeof _entry) return Promise.reject(_entry);

    logger.debug(room.name);

    return Promise.resolve([[
      room.id,
      room.name,
      room.fund,
      room.round_count,
      room.visitor_count,        // 游客人数
      room.banker_seat,          // 当前庄家座位
      room.round_pno,            // 当前第n局
      room.round_no,             // 当前第n把
      room.round_no_first_seat,  // 庄家摇骰子确定第一个起牌的人
      room.getReadyCount(),      // 举手人数
      room.act_status,
      room.act_seat,
    ], [
      _entry.id,
      _entry.opts.seat,
      _entry.nickname,
      _entry.weixin_avatar,
    ]]);
  }
})();

(() => {
  /**
   * 退出群组
   *
   * @return
   */
  exports.quit = function(server_id, channel_id){
    return new Promise((resolve, reject) => {
      biz.user.getByChannelId(server_id, channel_id)
      .then(p1)
      .then(doc => resolve(doc))
      .catch(reject);
    });
  };

  function p1(user){
    if(!user.group_id) return Promise.reject('不在群组');

    var room = roomPool.get(user.group_id);

    if(!room){
      return new Promise((resolve, reject) => {
        biz.user.quitGroup(user.id)
        .then(() => resolve())
        .catch(reject);
      });
    }

    if(!room.quit(user.id)){
      return Promise.resolve([
        room.getUsers(),
        user.id,
      ]);
    }

    return new Promise((resolve, reject) => {
      biz.user.quitGroup(user.id)
      .then(() => {
        if(1 > _.size(room.getUsers())) return resolve();

        resolve([
          room.getUsers(),
          user.id,
        ]);
      })
      .catch(reject);
    });
  }
})();

(() => {
  /**
   * 重新进入
   *
   * @return
   */
  exports.re_entry = function(server_id, channel_id){
    return new Promise((resolve, reject) => {
      biz.user.getByChannelId(server_id, channel_id)
      .then(p1)
      .then(doc => resolve(doc))
      .catch(reject);
    });
  };

  function p1(user){
    if(!user.group_id) return Promise.reject('已经退出');

    var room = roomPool.get(user.group_id);
    if(!room) return Promise.reject('房间不存在');

    var _re_entry = room.re_entry(user);
    if('string' === typeof _re_entry) return Promise.reject(_re_entry);

    return Promise.resolve([
      room.getUsers(),
      [_re_entry.id, _re_entry.opts.seat],
    ]);
  }
})();
