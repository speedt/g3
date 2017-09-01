/*!
 * emag.db
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const path = require('path'),
      cwd = process.cwd();

const Redis = require('speedt-redis');

const conf = require(path.join(cwd, 'settings')).redis;

var r = exports = module.exports = new Redis(conf);

process.on('exit', () => {
  if(r) r.quit();
});
