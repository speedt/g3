/*!
 * emag.login
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const pushCake = require('../controllers/pushCake');
const user     = require('../controllers/user');

module.exports = function(app){

  app.post('/user/login$',    user.login);
  app.get ('/user/login$',    user.loginUI);
  app.post('/user/register$', user.register);

  app.get('/', pushCake.indexUI);
};
