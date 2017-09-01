/*!
 * emag.backend
 * Copyright(c) 2017 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const path   = require('path');
const cwd    = process.cwd();
const _      = require('underscore');
const conf   = require('./settings');
const cfg    = require('emag.cfg');
const biz    = require('emag.biz');
const handle = require('emag.handle');
const amq    = require('emag.lib').amq;

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

process.on('SIGINT', exit);
process.on('SIGTERM', exit);
process.on('exit', exit);

biz.backend.open(conf.app.id, (err, code) => {
  if(err) return logger.error('backend %j open:', conf.app.id, err);
  logger.info('backend %j open: %j', conf.app.id, code);
});

amq.getClient((err) => {
  if(err) return logger.error('amq client:', err);

  amq.injection('/queue/front.start', handle.front.start, () => {});
  amq.injection('/queue/front.stop',  handle.front.stop,  () => {});

  amq.injection('/queue/channel.open',  handle.channel.open,  () => {});
  amq.injection('/queue/channel.close', handle.channel.close, () => {});
  amq.injection('/queue/qq.1001',       handle.channel.info,  () => {});

  amq.injection('/queue/qq.2001', handle.chat.one_for_one,   () => {});
  amq.injection('/queue/qq.2003', handle.chat.one_for_group, () => {});

  amq.injection('/queue/qq.3001', handle.group.search, () => {});
  amq.injection('/queue/qq.3005', handle.group.quit,   () => {});
  amq.injection('/queue/qq.3007', handle.group.entry,  () => {});

  amq.injection('/queue/qq.5005', handle.pushCake.ready,  () => {});
  amq.injection('/queue/qq.5013', handle.pushCake.craps,  () => {});
  amq.injection('/queue/qq.5015', handle.pushCake.crapsBanker,  () => {});
  amq.injection('/queue/qq.5017', handle.pushCake.bankerBet,  () => {});
  amq.injection('/queue/qq.5019', handle.pushCake.noBankerBet,  () => {});
});
