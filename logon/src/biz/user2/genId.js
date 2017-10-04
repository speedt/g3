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
  function p1(cb, trans){
    var id = utils.randomStr(6).toUpperCase();

    mysql.query(sql, [id], (err, docs) => {
      if(err) return cb(err);
      if(0 < docs.length) return p1(cb, trans);
      cb(null, id);
    });
  }

  var sql = 'SELECT a.* FROM s_user a WHERE a.id=?';

  /**
   * 生成空闲的群组id
   *
   * @return
   */
  exports = module.exports = function(trans){
    return new Promise((resolve, reject) => {
      p1((err, id) => {
        if(err) return reject(err);
        resolve(id);
      }, trans);
    });
  };
})();
