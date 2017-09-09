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

const logger = require('log4js').getLogger('biz.user_payment');

(() => {
  var sql = 'INSERT INTO s_user_payment (id, user_id, goods_id, create_time, order_id, original_data) VALUES (?, ?, ?, ?, ?, ?)';
  /**
   *
   * @return
   */
  exports.saveNew = function(newInfo, trans){
    newInfo.id            = utils.replaceAll(uuid.v1(), '-', '');
    newInfo.create_time   = new Date();
    newInfo.original_data = JSON.stringify(newInfo);

    return new Promise((resolve, reject) => {
      (trans || mysql).query(sql, [
        newInfo.id,
        newInfo.user_id,
        newInfo.goods_id,
        newInfo.create_time,
        newInfo.order_id,
        newInfo.original_data,
      ], (err, code) => {
        if(err) return reject(err);
        resolve(newInfo);
      });
    });
  };
})();

(() => {
  var sql = 'SELECT '+
              'c.goods_name, '+
              'b.user_name, '+
              'a.* '+
            'FROM '+
              '(SELECT * FROM s_user_payment WHERE user_id=?) a '+
              'LEFT JOIN s_user b ON (a.user_id=b.id) '+
              'LEFT JOIN w_goods c ON (a.goods_id=c.id) '+
            'WHERE '+
              'b.id IS NOT NULL AND '+
              'c.id IS NOT NULL '+
            'ORDER BY a.create_time DESC';
  /**
   *
   */
  exports.findAllByUserId = function(id, cb){
    mysql.query(sql, [id], cb);
  };
})();
