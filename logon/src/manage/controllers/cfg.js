/*!
 * emag.manage
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const biz = require('emag.biz');

const conf = require('../settings');

exports.indexUI = function(req, res, next){

  biz.cfg.findAll(1, function (err, docs){
    if(err) return next(err);

    res.render('settings/index', {
      conf: conf,
      data: {
        list_cfg:     docs,
        session_user: req.session.user,
        nav_choose:   ',02,0201,'
      }
    });
  });
};

exports.edit = function(req, res, next){
  var query = req.body;

  biz.cfg.editInfo(query, (err, status) => {
    if(err) return next(err);
    res.send({});
  });
};
