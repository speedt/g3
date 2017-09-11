/*!
 * emag.login
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const pushCake = require('../controllers/pushCake');
const user     = require('../controllers/user');

module.exports = function(app){
  app.post('/user/da426e6076be11e7ad1a29fa785dd421$', user.payment);
  app.post('/user/da426e6076be11e71d1a29fa785dd421$', user.wx);

  app.get ('/user/avatar$',   user.avatarUI);
  app.post('/user/loginWX$',  user.login);
  app.post('/user/login$',    user.login);
  app.get ('/user/login$',    user.loginUI);
  app.post('/user/register$', user.register);

  app.get('/', pushCake.indexUI);
};
