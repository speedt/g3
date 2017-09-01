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
const redis = require('emag.db').redis;
const _     = require('underscore');

(() => {
  const numkeys = 2;
  const sha1    = '969d3ead4da89885644e0a0b760f78bae06e3d8f';

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
  const sha1    = '3112ead50bc29f6ec9d3459def6b05adb517259d';

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
  const sha1    = 'bb198c5798cefca1522ca3f30f76a32f3758dc8c';

  /**
   * 获取全部后置机id（back_list.lua）
   *
   * @return
   */
  exports.findAll = function(cb){
    redis.evalsha(sha1, numkeys, conf.redis.database, cb);
  };
})();
