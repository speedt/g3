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
  var sql_1 = 'UPDATE s_user SET status=?, status_time=? WHERE id=?';

  var sql_2 = 'DELETE FROM s_user WHERE id=?';

  /**
   *
   * @return
   */
  exports = module.exports = function(id, force, cb){
    if(force) return mysql.query(sql_2, [id], cb);
    mysql.query(sql_1, [0, new Date(), id], cb);
  };
})();
