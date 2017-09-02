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
const _    = require('underscore');

const md5   = require('speedt-utils').md5;
const utils = require('speedt-utils').utils;

const mysql = require('emag.db').mysql;
const redis = require('emag.db').redis;

const cfg = require('emag.cfg');
const biz = require('emag.biz');

const roomPool = require('emag.model').roomPool;

const logger = require('log4js').getLogger('biz.pushCake');

(() => {
  function p1(user){
    if(!user.group_id) return Promise.reject('已经退出了');

    var room = roomPool.get(user.group_id);
    if(!room) return Promise.reject('房间不存在');

    var _user = room.craps4(user.id);

    if(!_user) return Promise.resolve();

    return Promise.resolve([
      room.users,
      [
        _user.id,
        _user.opts.seat,
        _user.opts.craps, // 当前摇的骰子
        room.act_seat,    // 下一个行动的座位
        room.banker_seat, // 庄家的座位
      ],
    ]);
  }

  /**
   * 4人摇骰子
   *
   * @return
   */
  exports.craps4 = function(server_id, channel_id, next){
    return new Promise((resolve, reject) => {
      biz.user.getByChannelId(server_id, channel_id)
      .then(p1)
      .then(doc => resolve(doc))
      .catch(reject);
    });
  };
})();

(() => {
  function p1(bet, user){
    if(!user.group_id) return Promise.reject('已经退出了');

    var room = roomPool.get(user.group_id);
    if(!room) return Promise.reject('房间不存在');

    var _user = room.bankerBet(user.id, bet);

    if(!_user) return Promise.resolve();

    return Promise.resolve([
      room.users,
      [
        _user.id,
        _user.opts.seat,
        room.act_seat,  // 下一个行动的座位
        user.opts.bet,  // 庄家的锅底
      ],
    ]);
  }

  /**
   * 庄家下锅底
   *
   * @return
   */
  exports.bankerBet = function(server_id, channel_id, bet){
    if(!_.isNumber(bet)) return Promise.reject('invalid_params');

    return new Promise((resolve, reject) => {
      biz.user.getByChannelId(server_id, channel_id)
      .then(p1.bind(null, bet))
      .then(doc => resolve(doc))
      .catch(reject);
    });
  };
})();

(() => {
  function p1(user){
    if(!user.group_id) return Promise.reject('用户不在任何群组');

    var room = roomPool.get(user.group_id);
    if(!room) return Promise.reject('房间不存在');

    room.crapsBanker(user.id);

    return Promise.resolve(user);
  }

  /**
   * 庄家摇骰子，确定谁先接牌
   *
   * @return
   */
  exports.crapsBanker = function(server_id, channel_id, next){
    return new Promise((resolve, reject) => {
      biz.user.getByChannelId(server_id, channel_id)
      .then(p1)
      .then(user => resolve(user))
      .catch(reject);
    });
  };
})();

(() => {
  function p1(bet, user){
    if(!user.group_id) return Promise.reject('用户不在任何群组');

    var room = roomPool.get(user.group_id);
    if(!room) return Promise.reject('房间不存在');

    room.noBankerBet(user.id, bet);

    return Promise.resolve(user);
  }

  /**
   * 闲家下注
   *
   * @return
   */
  exports.noBankerBet = function(server_id, channel_id, bet, next){
    return new Promise((resolve, reject) => {
      biz.user.getByChannelId(server_id, channel_id)
      .then(p1.bind(null, bet))
      .then(user => {
        cb(user, next);
        resolve(user);
      })
      .catch(reject);
    });
  };

  function cb(user, next){
    if(!user.group_id) return Promise.reject('用户不在任何群组');

    var room = roomPool.get(user.group_id);
    if(!room) return Promise.reject('房间不存在');

    var count = 0;

    for(let i of _.values(room.users)){
      if(0 < i.bet) count++;
    }

    if(!(3 < count)) return;

    setTimeout(function(){

      room.liangpai();

      next(user);

    }, 5000);
  }
})();
