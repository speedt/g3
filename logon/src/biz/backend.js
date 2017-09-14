/*!
 * emag.biz
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const path  = require('path');
const cwd   = process.cwd();
const conf  = require(path.join(cwd, 'settings'));

const utils = require('speedt-utils').utils;
const _     = require('underscore');

const redis = require('emag.db').redis;

(() => {
  const numkeys = 2;
  const sha1    = 'f80e603c00b8ae91b4cecb582bac25097b05c587';

  /**
   * back_open.lua
   *
   * @return
   */
  exports.open = function(back_id, cb){
    redis.evalsha(sha1, numkeys, conf.redis.database, back_id, _.now(), cb);
  };
})();

(() => {
  const numkeys = 2;
  const sha1    = '16dd95ae2b44a0df9af02f02e8751bbc87b6db4d';

  /**
   * back_close.lua
   *
   * @return
   */
  exports.close = function(back_id, cb){
    redis.evalsha(sha1, numkeys, conf.redis.database, back_id, cb);
  };
})();

(() => {
  const numkeys = 1;
  const sha1    = '6fc99857fffa2bbdf9ea5c34bffb7f5ddb326780';

  /**
   * 获取全部后置机id（back_list.lua）
   *
   * @return
   */
  exports.findAll = function(cb){
    redis.evalsha(sha1, numkeys, conf.redis.database, cb);
  };
})();
