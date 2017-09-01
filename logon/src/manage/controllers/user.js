/*!
 * emag.manage
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const biz = require('emag.biz');

const conf  = require('../settings');
const utils = require('speedt-utils').utils;

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
