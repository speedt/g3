/*!
 * emag.handle
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const path  = require('path');
const cwd   = process.cwd();
const conf  = require(path.join(cwd, 'settings'));

const _ = require('underscore');

const biz    = require('emag.biz');
const cfg    = require('emag.cfg');

const logger = require('log4js').getLogger('handle.pushCake');

(() => {
  /**
   * 举手
   *
   * @return
   */
  exports.ready = function(send, msg){
    try{ var data = JSON.parse(msg);
    }catch(ex){ return; }

    biz.pushCake.ready(data.serverId, data.channelId, next.bind(null, send, data))
    .then (p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };

  function p1(send, data, doc){
    if(!doc) return;

    var _data = [
      null,
      JSON.stringify([5002, doc[1], _.now(), data.seqId]),
    ];

    for(let i of _.values(doc[0])){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, err => {
        if(err) return logger.error('pushCake ready:', err);
      });
    }
  }

  function p2(send, data, err){
    if('object'   === typeof err) return logger.error('pushCake ready:', err);
    if('invalid_user_id' === err) return logger.debug('pushCake ready:', err);

    var _data = [
      data.channelId,
      JSON.stringify([5002, , _.now(), data.seqId, err]),
    ];

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, err => {
      if(err) return logger.error('pushCake ready:', err);
    });
  }

  function next(send, data, doc){
    if(!doc) return;

    var _data = [
      null,
      JSON.stringify([5002, doc[1], _.now(), data.seqId])
    ];

    for(let i of _.values(doc[0])){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, err => {
        if(err) return logger.error('pushCake ready:', err);
      });
    }
  }
})();

(() => {
  /**
   * 举手
   *
   * @return
   */
  exports.craps4 = function(send, msg){
    try{ var data = JSON.parse(msg);
    }catch(ex){ return; }

    biz.pushCake.craps4(data.serverId, data.channelId)
    .then (p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };

  function p1(send, data, doc){
    if(!doc) return;

    var _data = [
      null,
      JSON.stringify([5002, doc[1], _.now(), data.seqId]),
    ];

    for(let i of _.values(doc[0])){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, err => {
        if(err) return logger.error('pushCake craps4:', err);
      });
    }
  }

  function p2(send, data, err){
    if('object'   === typeof err) return logger.error('pushCake craps4:', err);
    if('invalid_user_id' === err) return logger.debug('pushCake craps4:', err);

    var _data = [
      data.channelId,
      JSON.stringify([5002, , _.now(), data.seqId, err]),
    ];

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, err => {
      if(err) return logger.error('pushCake craps4:', err);
    });
  }
})();

(() => {
  /**
   * 举手
   *
   * @return
   */
  exports.bankerBet = function(send, msg){
    try{ var data = JSON.parse(msg);
    }catch(ex){ return; }

    biz.pushCake.bankerBet(data.serverId, data.channelId, data.data)
    .then (p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };

  function p1(send, data, doc){
    if(!doc) return;

    var _data = [
      null,
      JSON.stringify([5002, doc[1], _.now(), data.seqId]),
    ];

    for(let i of _.values(doc[0])){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, err => {
        if(err) return logger.error('pushCake bankerBet:', err);
      });
    }
  }

  function p2(send, data, err){
    if('object'   === typeof err) return logger.error('pushCake bankerBet:', err);
    if('invalid_user_id' === err) return logger.debug('pushCake bankerBet:', err);

    var _data = [
      data.channelId,
      JSON.stringify([5002, , _.now(), data.seqId, err]),
    ];

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, err => {
      if(err) return logger.error('pushCake bankerBet:', err);
    });
  }
})();
