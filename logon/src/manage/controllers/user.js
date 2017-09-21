/*!
 * emag.manage
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const biz = require('emag.biz');

const conf  = require('../settings');
const utils = require('speedt-utils').utils;

const amq = require('speedt-amq');

exports.resetPwd = function(req, res, next){
  var query = req.body;

  biz.user.resetPwd(query.id, '123456', err => {
    if(err) return next(err);
    res.send({});
  });
};

exports.del = function(req, res, next){
  var query = req.body;

  biz.user.del(query.id, err => {
    if(err) return next(err);
    res.send({});
  });
};

exports.indexUI = function(req, res, next){
  biz.user.findAll(1, (err, docs) => {
    if(err) return next(err);

    res.render('user/index', {
      conf: conf,
      data: {
        list_user:    docs,
        session_user: req.session.user,
        nav_choose:   ',03,0301,'
      }
    });
  });
};

exports.editUI = function(req, res, next){
  var id = req.query.id;

  biz.user.getById(id)
  .then(doc => {
    if(!doc) return next(new Error('Not Found'));

    res.render('user/edit', {
      conf: conf,
      data: {
        user:         doc,
        session_user: req.session.user,
        nav_choose:   ',03,0301,'
      }
    });
  })
  .catch(next);
};

exports.edit = function(req, res, next){
  var query = req.body;

  biz.user.editInfo(query)
  .then(() => res.send({}))
  .catch(next);
};

exports.giftUI = function(req, res, next){
  var id = req.query.id;

  biz.gift.findAll(id, function (err, docs){
    if(err) return next(err);

    res.render('user/gift', {
      conf: conf,
      data: {
        list_gift:    docs,
        session_user: req.session.user,
        nav_choose:   ',03,0301,'
      }
    });
  });
};

exports.paymentUI = function(req, res, next){
  var id = req.query.id;

  biz.user_payment.findAllByUserId(id, function (err, docs){
    if(err) return next(err);

    res.render('user/payment', {
      conf: conf,
      data: {
        list_payment: docs,
        session_user: req.session.user,
        nav_choose:   ',03,0301,'
      }
    });
  });
};

(() => {
  function p1(query, docs){
    return new Promise((resolve, reject) => {
      if(0 === docs.length) return reject(new Error('前置机未启动'));

      p2(docs, query)
      .then(() => resolve())
      .catch(reject);
    });
  }

  function p2(frontends, query){
    return new Promise((resolve, reject) => {

      for(let i of frontends){
        amq.send('/queue/qq.5015', { priority: 8 }, query, (err, code) => { /*  */ });
      }

      resolve();
    });
  }

  exports.nasha = function(req, res, next){
    var query = req.body;

    if(!query.user_id)  return next(new Error('INVALID_PARAMS'));
    if(!query.group_id) return next(new Error('INVALID_PARAMS'));

    biz.frontend.findAll()
    .then(p1.bind(null, query))
    .then(() => res.send({}))
    .catch(next);
  };
})();
