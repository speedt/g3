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

const mysql = require('emag.db').mysql;
const redis = require('emag.db').redis;

(() => {
  var sql = 'SELECT a.* FROM s_cfg a WHERE a.type_=? ORDER BY a.title ASC';

  exports.findByType = function(type, cb){
    mysql.query(sql, [type], cb);
  };
})();

/**
 *
 * @return
 */
exports.findAll = function(status, cb){
  var sql = 'SELECT a.* FROM s_cfg a';
  if(null !== status){ sql += ' WHERE a.status=?'; }
  sql += ' ORDER BY a.title ASC';

  mysql.query(sql, [status], cb);
};

// (() => {
//   var sql = 'INSERT INTO s_cfg (type_, key_, value_, title, create_time, comment, status) VALUES (?, ?, ?, ?, ?, ?, ?)';

//   /**
//    * 新增配置表
//    * 调用后应该群发给所有后置机新增此值
//    *
//    * mysql cfg 写入 redis cfg
//    *
//    * @return
//    */
//   exports.saveNew = function(newInfo, cb){
//     newInfo.create_time = new Date();
//     newInfo.status = newInfo.status || 0;

//     mysql.query(sql, [
//       newInfo.type_,
//       newInfo.key_,
//       newInfo.value_,
//       newInfo.title,
//       newInfo.create_time,
//       newInfo.comment,
//       newInfo.status,
//     ], function (err, status){
//       if(err) return cb(err);

//       redis.select(conf.redis.database, function (err){
//         if(err) return cb(err);
//         redis.hset('cfg::'+ newInfo.type_, newInfo.key_, newInfo.value_, redis.print);
//         cb(null, newInfo);
//       });
//     });
//   };
// })();

(() => {
  var sql = 'UPDATE s_cfg SET value_=? WHERE key_=? AND type_=?';

  /**
   * 修改配置表
   * redis cfg 直接在此修改
   * 调用后应该群发给所有后置机更新此值
   *
   * mysql cfg 写入 redis cfg
   *
   * @return
   */
  exports.editInfo = function(newInfo, cb){
    mysql.query(sql, [
      newInfo.value_,
      newInfo.key_,
      newInfo.type_,
    ], function (err, status){
      if(err) return cb(err);

      redis.select(conf.redis.database, function (err){
        if(err) return cb(err);
        redis.hset('cfg::'+ newInfo.type_, newInfo.key_, newInfo.value_, redis.print);
        cb(null, newInfo);
      });
    });
  };
})();

/**
 * 后台管理服务器启动时加载
 *
 * mysql cfg 写入 redis cfg
 *
 * @return
 */
exports.init = function(cb){
  this.findAll(null, function (err, docs){
    if(err) return cb(err);

    redis.select(conf.redis.database, function (err){
      if(err) return cb(err);

      for(let i of docs){
        redis.hset('cfg::'+ i.type_, i.key_, i.value_, redis.print);
      }

      cb(null, docs);
    });
  });
};
