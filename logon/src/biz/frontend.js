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
const _     = require('underscore');
const utils = require('speedt-utils').utils;

const mysql = require('emag.db').mysql;
const redis = require('emag.db').redis;

(() => {
  const numkeys = 1;
  const sha1    = '480a1dfdd837f2f06fcc937705eccea78123f7b7';

  /**
   * 获取全部前置机id（front_list.lua）
   *
   * @return
   */
  exports.findAll = function(){
    return new Promise((resolve, reject) => {
      redis.evalsha(sha1, numkeys, conf.redis.database, (err, docs) => {
        if(err) return reject(err);
        resolve(docs);
      });
    });
  };
})();

/**
 * 可用的服务器
 *
 * @return
 */
exports.available = function(){
  return new Promise((resolve, reject) => {
    resolve('68');
  });
};
