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
      .then(() => {
        var users = [];

        for(let i of _.values(room.users)){
          users.push([i.id, i.nickname, i.opts.seat, i.weixin_avatar]);
        }

        resolve([room.users, [[
          room.id,
          room.name,
          room.fund,
          room.round_count,
          room.visitor_count,        // 游客人数
          room.banker_seat,          // 当前庄家座位
          room.round_no_first_seat,  // 庄家摇骰子确定第一个起牌的人
          room.round_pno,            // 当前第n局
          room.round_no,             // 当前第n把
          room.ready_count,          // 举手人数
          room.act_status,
          room.act_seat,
        ], users]]);
      })
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
      .then(doc => resolve(doc))
      .catch(reject);
    });
  };
})();

(() => {
  function formVali(server_id, channel_id, group_info){
    if(!_.isNumber(group_info.visitor_count)) return Promise.reject('invalid_params');
    if(6 < group_info.visitor_count || 0 > group_info.visitor_count) return Promise.reject('invalid_params');

    if(!_.isNumber(group_info.fund)) return Promise.reject('invalid_params');
    if(999999 < group_info.fund || 0 > group_info.fund) return Promise.reject('invalid_params');

    if(!_.isNumber(group_info.round_count)) return Promise.reject('invalid_params');
    if(4 < group_info.round_count || 1 > group_info.round_count) return Promise.reject('invalid_params');

    return new Promise((resolve, reject) => {
      biz.user.getByChannelId(server_id, channel_id)
      .then(p1.bind(null, group_info))
      .then(doc => resolve(doc))
      .catch(reject);
    });
  }

  function p1(group_info, user){
    if(user.group_id) return Promise.reject('请先退出');

    return new Promise((resolve, reject) => {
      biz.user.genFreeGroupId()
      .then(p2.bind(null, group_info, user))
      .then(doc => resolve(doc))
      .catch(reject);
    });
  }

  function p2(group_info, user, group_id){
    user.group_id = group_id;

    group_info.id             = group_id;
    group_info.create_user_id = user.id;

    return new Promise((resolve, reject) => {
      biz.user.createGroup(user)
      .then(p3.bind(null, group_info))
      .then(doc => resolve(doc))
      .catch(reject);
    });
  }

  function p3(group_info, user_info){
    var room = roomPool.create(group_info);
    if(!room) return Promise.reject('创建群组失败');
    return room.entry(user_info);
  }

  /**
   * 创建群组
   *
   * @return
   */
  exports.search = function(server_id, channel_id, group_info){
    return new Promise((resolve, reject) => {
      formVali(server_id, channel_id, group_info)
      .then(doc => resolve(doc))
      .catch(reject);
    });
  };
})();

(() => {
  function p1(user){
    if(!user.group_id) return Promise.reject('已经退出了');

    var room = roomPool.get(user.group_id);

    if(!room){
      return new Promise((resolve, reject) => {
        biz.user.quitGroup(user.id)
        .then(() => resolve())
        .catch(reject);
      });
    }

    if(room.quit(user.id)){
      return new Promise((resolve, reject) => {
        biz.user.quitGroup(user.id)
        .then(() => {
          if(1 > _.size(room.users)) return resolve();

          resolve([
            room.users,
            [users.id],
          ]);
        })
        .catch(reject);
      });
    }

    return Promise.resolve([
      room.users,
      [user.id, room.getUser(user.id).opts.is_quit],
    ]);
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
      .then(doc => resolve(doc))
      .catch(reject);
    });
  };
})();
