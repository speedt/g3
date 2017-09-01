/*!
 * emag.login
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const biz = require('emag.biz');

const conf  = require('../settings');
const utils = require('speedt-utils').utils;

exports.indexUI = function(req, res, next){
  res.render('pushCake/1_0_1', {
    conf: conf,
    data: {}
  });
};
