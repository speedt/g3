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

const md5    = require('speedt-utils').md5;
const utils  = require('speedt-utils').utils;
const anysdk = require('speedt-anysdk');

const mysql  = require('emag.db').mysql;
const redis  = require('emag.db').redis;

const cfg = require('emag.cfg');
const biz = require('emag.biz');

const _  = require('underscore');
_.str    = require('underscore.string');
_.mixin(_.str.exports());

(() => {
  /**
   *
   * @return
   */
  exports = module.exports = function(user_info){
    return new Promise((resolve, reject) => {
      anysdk.wx(user_info)
      .then(p2)
      // p2(user_info)
      .then(data => resolve(data))
      .catch(reject);
    });
  };

  function p2(data){
    var _data = _.clone(data);

    return new Promise((resolve, reject) => {
      biz.user2.getByWXOpenid(data.data.user_info.openid)
      .then(p3.bind(null, data.data.user_info))
      .then(() => resolve(_data))
      .catch(reject);
    });
  }

  var sql = 'UPDATE s_user SET wx_original=?, nickname=?, sex=?, wx_avatar=? WHERE wx_openid=?'

  function p3(user_info, user){
    if(!user) return newReg(user_info);

    user.wx_original = JSON.stringify(user_info);
    user.nickname    = user_info.nickname;
    user.sex         = user_info.sex;
    user.wx_avatar   = user_info.headimgurl;

    return new Promise((resolve, reject) => {
      mysql.query(sql, [
        user.wx_original,
        user.nickname,
        user.sex,
        user.wx_avatar,
        user.wx_openid,
      ], err => {
        if(err) return reject(err);
        resolve(user);
      });
    });
  }

  function newReg(user_info){
    user_info.wx_original = JSON.stringify(user_info);
    user_info.user_name   = user_info.openid;
    user_info.user_pass   = '123456tb';

    user_info.wx_openid  = user_info.openid;
    user_info.wx_unionid = user_info.unionid;
    user_info.wx_pass    = md5.hex('123456');
    user_info.wx_avatar  = user_info.headimgurl;

    return biz.user2.saveNew(user_info);
  }
})();
