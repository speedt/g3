/*!
 * emag.backend
 * Copyright(c) 2017 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const path   = require('path');
const cwd    = process.cwd();
const conf   = require('./settings');

const amq    = require('speedt-amq');

const _      = require('underscore');

const cfg    = require('emag.cfg');
const biz    = require('emag.biz');
const handle = require('emag.handle');

const log4js = require('log4js');

log4js.configure({
  appenders: {
    app: {
      type: 'dateFile',
      filename: path.join(cwd, 'logs', 'app'),
      pattern: '.yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      compress: true,
    },
    console: {
      type: 'console'
    }
  },
  categories: {
    default: {
      appenders: ['app', 'console'],
      level: 'debug'
    }
  }
});

const logger = log4js.getLogger('app');
// logger.trace('Entering cheese testing');
// logger.debug('Got cheese.');
// logger.info ('Cheese is Gouda.');
// logger.warn ('Cheese is quite smelly.');
// logger.error('Cheese is too ripe!');
// logger.fatal('Cheese was breeding ground for listeria.');

process.on('uncaughtException', err => {
  logger.error('uncaughtException:', err);
});

function exit(){
  biz.backend.close(conf.app.id, (err, code) => {
    if(err) return logger.error('backend %j close:', conf.app.id, err);
    logger.info('backend %j close: %j', conf.app.id, code);
    process.exit(0);
  });
}

process.on('SIGINT',  exit);
process.on('SIGTERM', exit);
process.on('exit',    exit);

biz.backend.open(conf.app.id, (err, code) => {
  if(err) return logger.error('backend %j open:', conf.app.id, err);
  logger.info('backend %j open: %j', conf.app.id, code);
});

function before(cb, send, msg){
  if(!_.isString(msg.body)) return logger.error('msg body is empty');
  cb(send, msg.body);
}

amq.getClient((err) => {
  if(err) return logger.error('amq client:', err);

  amq.injection('/queue/front.start', before.bind(null, handle.front.start), () => {});
  amq.injection('/queue/front.stop',  before.bind(null, handle.front.stop),  () => {});

  amq.injection('/queue/channel.open',  before.bind(null, handle.channel.open),  () => {});
  amq.injection('/queue/channel.close', before.bind(null, handle.channel.close), () => {});
  amq.injection('/queue/qq.1001',       before.bind(null, handle.channel.info),  () => {});

  amq.injection('/queue/qq.2001', before.bind(null, handle.chat.one_for_one),   () => {});
  amq.injection('/queue/qq.2003', before.bind(null, handle.chat.one_for_group), () => {});

  amq.injection('/queue/qq.3001', before.bind(null, handle.group.search),   () => {});
  amq.injection('/queue/qq.3003', before.bind(null, handle.group.re_entry), () => {});
  amq.injection('/queue/qq.3005', before.bind(null, handle.group.quit),     () => {});
  amq.injection('/queue/qq.3007', before.bind(null, handle.group.entry),    () => {});

  amq.injection('/queue/qq.5001', before.bind(null, handle.pushCake.ready),  () => {});
  amq.injection('/queue/qq.5003', before.bind(null, handle.pushCake.craps4), () => {});
  // amq.injection('/queue/qq.5017', handle.pushCake.bankerBet,   () => {});
  // amq.injection('/queue/qq.5015', handle.pushCake.bankerCraps, () => {});
  // amq.injection('/queue/qq.5019', handle.pushCake.unBankerBet, () => {});
  // amq.injection('/queue/qq.5071', handle.pushCake.bankerGoOn,  () => {});
});
