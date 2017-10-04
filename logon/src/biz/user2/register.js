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
  // 2-10个字符，支持中文，英文大小写、数字、下划线
  var regex_user_name = /^[\u4E00-\u9FA5a-zA-Z0-9_]{2,10}$/;
  // 6-16个字符，支持英文大小写、数字、下划线，区分大小写
  var regex_user_pass = /^[a-zA-Z0-9_]{6,16}$/;

  /**
   *
   * @return
   */
  exports = module.exports = function(user_info){
    user_info = user_info || {};

    if(!_.isString(user_info.user_name))
      return Promise.reject('INVALID_PARAMS');

    user_info.user_name = _.trim(user_info.user_name);

    if(!regex_user_name.test(user_info.user_name))
      return Promise.reject('INVALID_PARAMS');

    if(!_.isString(user_info.user_pass))
      return Promise.reject('INVALID_PARAMS');

    user_info.user_pass = _.trim(user_info.user_pass);

    if(!regex_user_pass.test(user_info.user_pass))
      return Promise.reject('INVALID_PARAMS');

    return biz.user2.saveNew(user_info);
  };
})();
