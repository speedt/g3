/*!
 * emag.biz
 * Copyright(c) 2017 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const path = require('path');
const cwd  = process.cwd();
const conf = require(path.join(cwd, 'settings'));

const uuid  = require('node-uuid');

const md5   = require('speedt-utils').md5;
const utils = require('speedt-utils').utils;

const mysql  = require('emag.db').mysql;
const redis  = require('emag.db').redis;

const cfg = require('emag.cfg');
const biz = require('emag.biz');

const _  = require('underscore');
_.str    = require('underscore.string');
_.mixin(_.str.exports());

(() => {
  /**
   *
   * @return
   */
  exports = module.exports = function(user_info, trans){
    return new Promise((resolve, reject) => {
      biz.user2.getByName(user_info.user_name)
      .then(p1)
      .then(biz.user2.genId)
      .then(p2.bind(null, user_info))
      .then(() => resolve(user_info))
      .catch(reject);
    });
  };

  function p1(user){
    if(user) return Promise.reject('用户名已存在');
    return Promise.resolve();
  }

  var sql = 'INSERT INTO s_user (id, '+
                                'user_name, '+
                                'user_pass, '+
                                'status, '+
                                'create_time, '+
                                'mobile, '+
                                'wx_openid, '+
                                'wx_unionid, '+
                                'wx_pass, '+
                                'wx_avatar, '+
                                'wx_original, '+
                                'current_score, '+
                                'nickname, '+
                                'vip, '+
                                'consume_count, '+
                                'win_count, '+
                                'lose_count, '+
                                'win_score_count, '+
                                'lose_score_count, '+
                                'line_gone_count, '+
                                'gold_count, '+
                                'sex) VALUES (?, '+
                                '?, '+
                                '?, '+
                                '?, '+
                                '?, '+
                                '?, '+
                                '?, '+
                                '?, '+
                                '?, '+
                                '?, '+
                                '?, '+
                                '?, '+
                                '?, '+
                                '?, '+
                                '?, '+
                                '?, '+
                                '?, '+
                                '?, '+
                                '?, '+
                                '?, '+
                                '?, '+
                                '?)';

  function p2(user_info, id){
    user_info.id               = id;
    user_info.user_pass        = md5.hex(user_info.user_pass || '123456');
    user_info.status           = 1;
    user_info.create_time      = new Date();
    user_info.current_score    = 0;
    user_info.vip              = 0;
    user_info.consume_count    = 0;
    user_info.win_count        = 0;
    user_info.lose_count       = 0;
    user_info.win_score_count  = 0;
    user_info.lose_score_count = 0;
    user_info.line_gone_count  = 0;
    user_info.gold_count       = user_info.gold_count || 20;
    user_info.sex              = user_info.sex        || 0;

    return new Promise((resolve, reject) => {
      mysql.query(sql, [
        user_info.id,
        user_info.user_name,
        user_info.user_pass,
        user_info.status,
        user_info.create_time,
        user_info.mobile,
        user_info.wx_openid,
        user_info.wx_unionid,
        user_info.wx_pass,
        user_info.wx_avatar,
        user_info.wx_original,
        user_info.current_score,
        user_info.nickname,
        user_info.vip,
        user_info.consume_count,
        user_info.win_count,
        user_info.lose_count,
        user_info.win_score_count,
        user_info.lose_score_count,
        user_info.line_gone_count,
        user_info.gold_count,
        user_info.sex,
      ], err => {
        if(err) return reject(err);
        resolve(user_info);
      });
    });
  }
})();
