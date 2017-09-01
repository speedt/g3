/*!
 * emag.manage
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const biz = require('emag.biz');

const conf = require('../settings');

/**
 *
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){
  res.render('site/index', {
    conf: conf,
    description: '',
    keywords: ',html5',
    data: {
      session_user: req.session.user,
      nav_choose:   ',01,'
    }
  });
};

/**
 *
 * @params
 * @return
 */
exports.welcomeUI = function(req, res, next){
  res.render('site/welcome', {
    conf: conf,
    description: '',
    keywords: ',html5'
  });
};
