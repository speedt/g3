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
  function p1(group_id, user){
    if(user.group_id) return Promise.reject('请先退出');

    var room = roomPool.get(group_id);
    if(!room) return Promise.reject('房间不存在');

    user.group_id = group_id;

    return new Promise((resolve, reject) => {
      biz.user.entryGroup(user)
      .then(room.entry.bind(room))
      .then(() => resolve())
      .catch(reject);
    });
  }

  /**
   *
   * @return
   */
  exports.entry = function(server_id, channel_id, group_id){
    return new Promise((resolve, reject) => {
      biz.user.getByChannelId(server_id, channel_id)
      .then(p1.bind(null, group_id))
      .then(biz.user.getByChannelId.bind(null, server_id, channel_id))
      .then(user => resolve(user))
      .catch(reject);
    });
  };
})();

(() => {
  function formVali(group_info){
    return new Promise((resolve, reject) => {
      if(!_.isNumber(group_info.visitor_count)) return reject('invalid_params');
      if(6 < group_info.visitor_count || 0 > group_info.visitor_count) return reject('invalid_params');

      if(!_.isNumber(group_info.fund)) return reject('invalid_params');
      if(999999 < group_info.fund || 0 > group_info.fund) return reject('invalid_params');

      if(!_.isNumber(group_info.round_count)) return reject('invalid_params');
      if(4 < group_info.round_count || 0 > group_info.round_count) return reject('invalid_params');

      resolve(group_info);
    });
  }

  function p1(server_id, channel_id, group_info){
    return new Promise((resolve, reject) => {
      biz.user.getByChannelId(server_id, channel_id)
      .then(p2.bind(null, group_info))
      .then(() => resolve())
      .catch(reject);
    });
  }

  function p2(group_info, user){
    if(user.group_id) return Promise.reject('请先退出');

    return new Promise((resolve, reject) => {
      biz.user.genFreeGroupId()
      .then(p3.bind(null, group_info, user))
      .then(() => resolve())
      .catch(reject);
    });
  }

  function p3(group_info, user, group_id){
    user.group_id             = group_id;
    group_info.id             = group_id;
    group_info.create_user_id = user.id;

    return new Promise((resolve, reject) => {
      biz.user.createGroup(user)
      .then(p4.bind(null, group_info))
      .then(() => resolve())
      .catch(reject);
    });
  }

  function p4(group_info, user){
    var room = roomPool.create(group_info);
    if(!room) return Promise.reject('创建群组失败');
    return room.entry(user);
  }

  /**
   * 创建群组
   *
   * @return
   */
  exports.search = function(server_id, channel_id, group_info){
    return new Promise((resolve, reject) => {
      formVali(group_info)
      .then(p1.bind(null, server_id, channel_id))
      .then(biz.user.getByChannelId.bind(null, server_id, channel_id))
      .then(user => {
        user.seat = 1;
        resolve(user);
      })
      .catch(reject);
    });
  };
})();

(() => {
  function p1(user){
    if(!user.group_id) return Promise.reject('用户不在任何群组');

    var user_info = {
      group_id: user.group_id,
      id:       user.id,
    };

    var room = roomPool.get(user.group_id);

    if(!room){
      return new Promise((resolve, reject) => {
        biz.user.quitGroup(user.id)
        .then(() => resolve(user_info))
        .catch(reject);
      });
    }

    if(room.quit(user.id)){
      return new Promise((resolve, reject) => {
        biz.user.quitGroup(user.id)
        .then(() => resolve(user_info))
        .catch(reject);
      });
    }

    return Promise.resolve(user_info);
  }

  /**
   * 退出群组
   *
   * @return
   */
  exports.quit = function(server_id, channel_id){
    return new Promise((resolve, reject) => {
      biz.user.getByChannelId(server_id, channel_id)
      .then(p1)
      .then(user => resolve(user))
      .catch(reject);
    });
  };
})();
