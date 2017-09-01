/*!
 * emag.db
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const path = require('path'),
      cwd = process.cwd();

const Mysql = require('speedt-mysql');

const conf = require(path.join(cwd, 'settings')).mysql;

exports = module.exports = new Mysql(conf);