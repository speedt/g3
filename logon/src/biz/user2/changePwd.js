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
   * 修改密码
   *
   * @return
   */
  exports = module.exports = function(logInfo /* 用户名及密码 */){
    if(!_.isString(logInfo.user_pass))
      return Promise.reject('INVALID_PARAMS');

    logInfo.user_pass = _.trim(logInfo.user_pass);

    if('' === logInfo.user_pass)
      return Promise.reject('INVALID_PARAMS');

    return new Promise((resolve, reject) => {
      biz.user2.getById(logInfo.id)
      .then(p1.bind(null, logInfo))
      .then(p2.bind(null, logInfo))
      .then(() => resolve(logInfo))
      .catch(reject);
    });
  };

  function p1(logInfo, user){
    if(md5.hex(logInfo.old_pass) !== user.user_pass)
      return Promise.reject('原始密码错误');

    return Promise.resolve();
  }

  var sql = 'UPDATE s_user set user_pass=? WHERE id=?';

  function p2(logInfo){
    logInfo.user_pass = md5.hex(logInfo.user_pass);

    return new Promise((resolve, reject) => {
      mysql.query(sql, [
        logInfo.user_pass,
        logInfo.id,
      ], err => {
        if(err) return reject(err);
        resolve();
      });
    });
  }
})();
