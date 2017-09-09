/*!
 * emag.biz
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const path = require('path');
const cwd  = process.cwd();
const conf = require(path.join(cwd, 'settings'));

const uuid  = require('node-uuid');

const md5   = require('speedt-utils').md5;
const utils = require('speedt-utils').utils;

const mysql = require('emag.db').mysql;
const redis = require('emag.db').redis;

const cfg = require('emag.cfg');
const biz = require('emag.biz');

const _  = require('underscore');
_.str    = require('underscore.string');
_.mixin(_.str.exports());

const logger = require('log4js').getLogger('biz.user');

(() => {
  /**
   *
   * @return
   */
  exports.payment = function(payInfo, cb){
    // TODO
  };
})();

(() => {
  var sql = 'INSERT INTO s_user_payment (id, user_id, goods_id, create_time, order_id) VALUES (?, ?, ?, ?, ?)';
  /**
   *
   * @return
   */
  exports.saveNew = function(newInfo, trans){
    newInfo.id          = utils.replaceAll(uuid.v1(), '-', '');
    newInfo.create_time = new Date();

    return new Promise((resolve, reject) => {
      (trans || mysql).query(sql, [
        newInfo.id,
        newInfo.user_id,
        newInfo.goods_id,
        newInfo.create_time,
        newInfo.order_id,
      ], (err, code) => {
        if(err) return reject(err);
        resolve(newInfo);
      });
    });
  };
})();