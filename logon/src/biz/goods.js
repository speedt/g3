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
  var sql = 'SELECT a.* FROM w_goods a ORDER BY a.create_time DESC';

  exports.findAll = function(cb){
    mysql.query(sql, null, cb);
  };
})();

(() => {
  var sql = 'SELECT '+
              'c.prop_name game_prop_name, '+
              'b.goods_name, '+
              'a.* '+
            'FROM '+
              '(SELECT * FROM w_goods_detail WHERE goods_id=?) a '+
              'LEFT JOIN w_goods b ON (a.goods_id=b.id) '+
              'LEFT JOIN w_game_prop c ON (a.game_prop_id=c.id) '+
            'WHERE '+
              'b.id IS NOT NULL AND '+
              'c.id IS NOT NULL '+
            'ORDER BY a.create_time DESC';
  /**
   * 获取某一商品的详细道具列表
   *
   * @param id 商品id
   * @return
   */
  exports.findDetailById = function(id, trans){
    return new Promise((resolve, reject) => {
      (trans || mysql).query(sql, [id], (err, docs) => {
        if(err) return reject(err);
        resolve(docs);
      })
    })
  };
})();

(() => {
  const sql = 'INSERT INTO w_goods (id, goods_name, goods_desc, create_time, cost, payment_id, disposable, interval_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

  /**
   *
   * @return
   */
  exports.saveNew = function(newInfo, cb){
    mysql.query(sql, [
      utils.replaceAll(uuid.v1(), '-', ''),
      newInfo.goods_name,
      newInfo.goods_desc,
      new Date(),
      newInfo.cost          || 0,
      newInfo.payment_id,
      newInfo.disposable    || 0,
      newInfo.interval_time || 0,
    ], cb);
  };
})();

(() => {
  const sql = 'UPDATE w_goods SET goods_name=?, goods_desc=?, cost=?, payment_id=?, disposable=?, interval_time=? WHERE id=?';

  /**
   *
   * @return
   */
  exports.editInfo = function(newInfo, cb){
    mysql.query(sql, [
      newInfo.goods_name,
      newInfo.goods_desc,
      newInfo.cost          || 0,
      newInfo.payment_id,
      newInfo.disposable    || 0,
      newInfo.interval_time || 0,
      newInfo.id,
    ], cb);
  };
})();

(() => {
  var sql = 'SELECT a.* FROM w_goods a WHERE a.id=?';

  /**
   *
   * @return
   */
  exports.getById = function(id){
    return new Promise((resolve, reject) => {
      mysql.query(sql, [id], (err, docs) => {
        if(err) return reject(err);
        resolve(mysql.checkOnly(docs) ? docs[0] : null);
      });
    });
  };
})();

(() => {
  var sql = 'DELETE FROM w_goods WHERE id=?';

  /**
   *
   * @return
   */
  exports.del = function(id, cb){
    cb(new Error('Permission Denied'));
  };
})();
