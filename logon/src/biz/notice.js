/*!
 * emag.biz
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const path = require('path');
const cwd  = process.cwd();
const conf = require(path.join(cwd, 'settings'));

const utils = require('speedt-utils').utils;
const _     = require('underscore');
const uuid  = require('node-uuid');

const mysql = require('emag.db').mysql;
const redis = require('emag.db').redis;

(() => {
  var sql = 'SELECT '+
              'b.user_name, '+
              'a.* '+
            'FROM '+
              '(SELECT * FROM w_notice) a '+
              'LEFT JOIN s_manager b ON (a.user_id=b.id) '+
            'WHERE '+
              'b.id IS NOT NULL '+
            'ORDER BY a.create_time DESC';
  /**
   *
   * @return
   */
  exports.findAll = function(cb){
    mysql.query(sql, null, cb);
  };
})();

(() => {
  const sql = 'INSERT INTO w_notice (id, title, content, create_time, user_id) VALUES (?, ?, ?, ?, ?)';

  /**
   *
   * @return
   */
  exports.saveNew = function(newInfo, cb){
    newInfo.id          = utils.replaceAll(uuid.v1(), '-', '');
    newInfo.create_time = new Date();

    mysql.query(sql, [
      newInfo.id,
      newInfo.title,
      newInfo.content,
      newInfo.create_time,
      newInfo.user_id,
    ], cb);
  };
})();

(() => {
  const sql = 'UPDATE w_notice SET title=?, content=? WHERE id=?';

  /**
   *
   * @return
   */
  exports.editInfo = function(newInfo, cb){
    mysql.query(sql, [
      newInfo.title,
      newInfo.content,
      newInfo.id,
    ], cb);
  };
})();

(() => {
  var sql = 'SELECT a.* FROM w_notice a WHERE a.id=?';

  /**
   *
   * @return
   */
  exports.getById = function(id){
    return new Promise((resolve, reject) => {
      mysql.query(sql, [id], (err, docs) => {
        if(err) return reject(err);
        resolve(mysql.checkOnly(docs) ? docs[0] : null);
      })
    });
  };
})();

(() => {
  var sql = 'DELETE FROM w_notice WHERE id=?';

  /**
   *
   * @return
   */
  exports.del = function(id, cb){
    mysql.query(sql, [id], cb);
  };
})();
