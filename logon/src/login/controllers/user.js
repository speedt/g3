/*!
 * emag.login
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const biz = require('emag.biz');

const conf  = require('../settings');
const utils = require('speedt-utils').utils;

const request = require('request');

const logger = require('log4js').getLogger('controllers.user');

(() => {
  function p1(res, user){
    res.send({});
  }

  function p2(res, next, err){
    if('string' === typeof err)
      return res.send({ error: { msg: err } });
    next(err);
  }

  exports.register = function(req, res, next){
    var query  = req.body;

    biz.user.register(query)
    .then(p1.bind(null, res))
    .catch(p2.bind(null, res, next));
  };
})();

exports.loginUI = function(req, res, next){
  res.render('user/login', {
    conf: conf,
    data: {}
  });
};

(() => {
  function p1(res, token){
    res.send({ data: token });
  }

  function p2(res, next, err){
    if('string' === typeof err)
      return res.send({ error: { code: err } });
    next(err);
  }

  exports.login = function(req, res, next){
    var query = req.body;

    biz.user.login(query)
    .then (p1.bind(null, res))
    .catch(p2.bind(null, res, next));
  };
})();

(() => {
  function p1(res, token){
    res.send(token);
  }

  function p2(res, next, err){
    if('string' === typeof err)
      return res.send({ error: { code: err } });
    next(err);
  }

  exports.wx = function(req, res, next){
    var query = req.body;

    biz.user.wx(query)
    .then (p1.bind(null, res))
    .catch(p2.bind(null, res, next));
  };
})();

(() => {
  /**
   *
   * @return
   */
  exports.payment = function(req, res, next){
    var query = req.body;

    biz.user.payment(query)
    .then (p1.bind(null, res))
    .catch(p2.bind(null, res, next));
  };

  function p1(res){
    res.send('OK');
  }

  function p2(res, next, err){
    if('string' === typeof err)
      return res.send({ error: { code: err } });
    next(err);
  }
})();

exports.avatarUI = function(req, res, next){
  var id = req.query.id;

  biz.user.getById(id)
  .then(doc => {
    if(!doc || !doc.weixin_avatar) return next(new Error('Not Found'));
    req.pipe(request(doc.weixin_avatar).on('error', next)).pipe(res);
  })
  .catch(next);
};
