/*!
 * emag.handle
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const _      = require('underscore');
const logger = require('log4js').getLogger('handle.front');

exports.start = function(send, front_id){
  logger.info('front %j start: %j', front_id, _.now());
};

exports.stop = function(send, front_id){
  logger.info('front %j stop: %j', front_id, _.now());
};
