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
  /**
   *
   * @return
   */
  exports = module.exports = function(server_id, channel_id){
    return new Promise((resolve, reject) => {
      closeChannel(server_id, channel_id)
      .then(biz.group.quit.bind(null, server_id, channel_id))
      .then(doc => resolve(doc))
      .catch(reject);
    });
  };

  var sha1    = '6f3e8fc00771defac1a08fd0d7f2aa97e9734f37';
  var numkeys = 3;

  function closeChannel(server_id, channel_id){
    return new Promise((resolve, reject) => {
      redis.evalsha(
        sha1,
        numkeys,
        conf.redis.database,  /**/
        server_id,            /**/
        channel_id,           /**/
        (err, code) => {
          if(err) return reject(err);
          if(!_.isArray(code)) return reject(code);
          resolve(utils.arrToObj(code));
        });
    });
  }
})();
