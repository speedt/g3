/*!
 * emag.manage
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const goods   = require('../controllers/goods');
const user    = require('../controllers/user');
const notice  = require('../controllers/notice');
const cfg     = require('../controllers/cfg');
const manager = require('../controllers/manager');
const site    = require('../controllers/site');

module.exports = function(app){

  app.post('/goods/edit$', manager.login_validate, goods.edit);
  app.get ('/goods/edit$', manager.login_validate, goods.editUI);
  app.post('/goods/add$',  manager.login_validate, goods.add);
  app.get ('/goods/add$',  manager.login_validate, goods.addUI);
  app.post('/goods/del$',  manager.login_validate, goods.del);
  app.get ('/goods/',      manager.login_validate, goods.indexUI);

  app.get ('/user/payment$',  manager.login_validate, user.paymentUI);
  app.get ('/user/gift$',     manager.login_validate, user.giftUI);
  app.post('/user/resetPwd$', manager.login_validate, user.resetPwd);
  app.post('/user/edit$',     manager.login_validate, user.edit);
  app.get ('/user/edit$',     manager.login_validate, user.editUI);
  app.post('/user/del$',      manager.login_validate, user.del);
  app.get ('/user/',          manager.login_validate, user.indexUI);

  app.post('/notice/send$', manager.login_validate, notice.send);
  app.post('/notice/edit$', manager.login_validate, notice.edit);
  app.get ('/notice/edit$', manager.login_validate, notice.editUI);
  app.post('/notice/add$',  manager.login_validate, notice.add);
  app.get ('/notice/add$',  manager.login_validate, notice.addUI);
  app.post('/notice/del$',  manager.login_validate, notice.del);
  app.get ('/notice/',      manager.login_validate, notice.indexUI);

  app.get ('/settings/',      manager.login_validate, cfg.indexUI);
  app.post('/settings/edit$', manager.login_validate, cfg.edit);

  app.get ('/manager/profile$',   manager.login_validate, manager.profileUI);
  app.post('/manager/changePwd$', manager.login_validate, manager.changePwd);
  app.get ('/manager/changePwd$', manager.login_validate, manager.changePwdUI);

  app.get ('/manager/login$',  manager.loginUI);
  app.post('/manager/login$',  manager.login);
  app.get ('/manager/logout$', manager.logoutUI);

  app.get('/welcome$', manager.login_validate, site.welcomeUI);
  app.get ('/',        manager.login_validate, site.indexUI);
};
