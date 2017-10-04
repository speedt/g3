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
  var sql = 'UPDATE s_user SET backend_id=?, group_id=?, group_entry_time=? WHERE id=?';

  /**
   *
   * @return
   */
  exports = module.exports = function(user_info, trans){
    user_info.group_entry_time = new Date().getTime();
    user_info.backend_id       = conf.app.id;

    return new Promise((resolve, reject) => {
      (trans || mysql).query(sql, [
        user_info.backend_id,
        user_info.group_id,
        user_info.group_entry_time,
        user_info.id,
      ], err => {
        if(err) return reject(err);
        resolve(user_info);
      })
    });
  };
})();
