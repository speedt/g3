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
  var sql = 'SELECT a.* FROM s_user a WHERE a.server_id=? AND a.channel_id=?';

  /**
   * 获取用户
   *
   * @param server_id
   * @param channel_id
   * @return
   */
  exports = module.exports = function(server_id, channel_id){
    return new Promise((resolve, reject) => {
      mysql.query(sql, [server_id, channel_id], (err, docs) => {
        if(err) return reject(err);
        if(!mysql.checkOnly(docs)) return reject('通道不存在');
        resolve(docs[0]);
      });
    });
  };
})();
