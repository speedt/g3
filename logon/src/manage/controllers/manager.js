/*!
 * emag.manage
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const conf = require('../settings');
const utils = require('speedt-utils').utils;

const biz = require('emag.biz');

exports.changePwd = function(req, res, next){
  var query = req.body;

  query.id = req.session.userId;

  biz.manager.changePwd(query)
  .then(() => {
    res.send({});
  })
  .catch(err => {
    if('string' !== typeof err) return next(err);
    res.send({ error: { msg: err } });
  });
};

exports.changePwdUI = function(req, res, next){
  res.render('manager/changePwd', {
    conf: conf,
    data: {
      session_user: req.session.user,
    }
  });
};

exports.profileUI = function(req, res, next){
  res.render('manager/profile', {
    conf: conf,
    data: {
      session_user: req.session.user,
    }
  });
};

exports.loginUI = function(req, res, next){
  res.render('manager/login', {
    conf: conf,
    data: {
      refererUrl: req.query.refererUrl || ''
    }
  });
};

exports.login = function(req, res, next){
  var query = req.body;

  biz.manager.login(query)
  .then(user => {
    // session
    req.session.userId = user.id;
    req.session.user = user;

    res.send({});
  })
  .catch(err => {
    if('string' !== typeof err) return next(err);
    res.send({ error: { msg: err } });
  });
};


exports.login_validate = function(req, res, next){
  if(req.session.userId) return next();
  if(req.xhr) return res.send({ error: { msg: '无权访问' } });
  res.redirect(conf.html.virtualPath +'manager/login?refererUrl='+ escape(conf.html.virtualPath + req.url.substr(1)));
};

exports.logoutUI = function(req, res, next){
  req.session.destroy();
  res.redirect(conf.html.virtualPath +'manager/login');
};
