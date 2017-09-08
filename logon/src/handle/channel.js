/*!
 * emag.handle
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const path = require('path');
const cwd  = process.cwd();
const conf = require(path.join(cwd, 'settings'));

const _ = require('underscore');

const biz    = require('emag.biz');
const cfg    = require('emag.cfg');

const logger = require('log4js').getLogger('handle.channel');

(() => {
  /**
   *
   */
  exports.open = function(send, msg){
    var s = msg.split('::');
    var data = { serverId: s[0], channelId: s[1] };

    biz.user.registerChannel(data.serverId, data.channelId)
    .then (p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };

  function p1(send, data, doc){
    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, [
      data.channelId,
      JSON.stringify([1, conf.app.ver, _.now()]),
    ], err => {
      if(err) return logger.error('channel open:', err);
    });
  }

  function p2(send, data, err){
    if('object' === typeof err) return logger.error('channel open:', err);
    switch(err){
      case 'invalid_user_id': return logger.debug('channel open:', err);
      default: logger.debug('channel open:', err);
    }
  }
})();

(() => {
  /**
   *
   */
  exports.close = function(send, msg){
    var s = msg.split('::');
    var data = { serverId: s[0], channelId: s[1] };

    biz.user.logout(data.serverId, data.channelId)
    .then (p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };

  function p1(send, data, doc){
    if(!doc) return;

    var _data = [];
    _data.push(null);
    _data.push(JSON.stringify([1004, doc[1], _.now(), data.seqId]));

    for(let i of _.values(doc[0])){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, err => {
        if(err) return logger.error('channel close:', err);
      });
    }
  }

  function p2(send, data, err){
    if('object' === typeof err) return logger.error('channel close:', err);
    switch(err){
      case 'invalid_user_id': return logger.debug('channel close:', err);
      default: logger.debug('channel close:', err);
    }
  }
})();

(() => {
  /**
   *
   */
  exports.info = function(send, msg){
    try{ var data = JSON.parse(msg);
    }catch(ex){ return; }

    biz.user.getByChannelId(data.serverId, data.channelId)
    .then (p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };

  function p1(send, data, doc){
    var _data = [data.channelId, JSON.stringify([1002, doc, _.now(), data.seqId])];
    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, err => {
      if(err) return logger.error('channel info:', err);
    });
  }

  function p2(send, data, err){
    if('object' === typeof err) return logger.error('channel info:', err);
    switch(err){
      case 'invalid_user_id': return logger.debug('channel info:', err);
      default: logger.debug('channel info:', err);
    }
  }
})();
