/*!
 * emag.biz
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const assert = require('assert');

const path = require('path');
const cwd  = process.cwd();
const conf = require(path.join(cwd, 'settings'));

const uuid       = require('node-uuid');

const md5   = require('speedt-utils').md5;
const utils = require('speedt-utils').utils;

const mysql = require('emag.db').mysql;
const redis = require('emag.db').redis;

const cfg = require('emag.cfg');
const biz = require('emag.biz');

const _  = require('underscore');
_.str    = require('underscore.string');
_.mixin(_.str.exports());

const logger = require('log4js').getLogger('biz.manager');

(() => {
  var sql = 'SELECT a.* FROM s_manager a WHERE a.user_name=?';

  /**
   *
   * @return
   */
  exports.getByName = function(user_name, trans){
    return new Promise((resolve, reject) => {
      (trans || mysql).query(sql, [user_name], (err, docs) => {
        if(err) return reject(err);
        resolve(mysql.checkOnly(docs) ? docs[0] : null);
      });
    });
  };
})();

(() => {
  var sql = 'SELECT a.* FROM s_manager a WHERE a.id=?';

  /**
   *
   * @return
   */
  exports.getById = function(id, trans){
    return new Promise((resolve, reject) => {
      (trans || mysql).query(sql, [id], (err, docs) => {
        if(err) return reject(err);
        resolve(mysql.checkOnly(docs) ? docs[0] : null);
      });
    });
  };
})();

(() => {
  /**
   * 用户登陆
   *
   * @return
   */
  exports.login = function(logInfo /* 用户名及密码 */){
    return new Promise((resolve, reject) => {
      biz.manager.getByName(logInfo.user_name)
      .then(p1.bind(null, logInfo))
      .then(doc => resolve(doc))
      .catch(reject);
    });
  };

  function p1(logInfo, user){
    if(!user)             return Promise.reject('用户不存在');
    if(1 !== user.status) return Promise.reject('禁用状态');
    if(md5.hex(logInfo.user_pass) !== user.user_pass)
      return Promise.reject('用户名或密码输入错误');

    return Promise.resolve(user);
  }
})();

(() => {
  /**
   * 修改密码
   *
   * @return
   */
  exports.changePwd = function(logInfo){
    return new Promise((resolve, reject) => {
      formVali(logInfo)
      .then(biz.manager.getById.bind(null, logInfo.id))
      .then(p1.bind(null, logInfo))
      .then(p2.bind(null, logInfo))
      .then(() => resolve(logInfo))
      .catch(reject);
    });
  };

  function formVali(logInfo){
    if(!_.isString(logInfo.user_pass))
      return Promise.reject('INVALID_PARAMS');

    logInfo.user_pass = _.trim(logInfo.user_pass);

    if('' === logInfo.user_pass)
      return Promise.reject('INVALID_PARAMS');

    return Promise.resolve();
  }

  function p1(logInfo, user){
    assert.notEqual(null, user);

    if(md5.hex(logInfo.old_pass) !== user.user_pass)
      return Promise.reject('原始密码错误');

    return Promise.resolve();
  }

  var sql = 'UPDATE s_manager set user_pass=? WHERE id=?';

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
