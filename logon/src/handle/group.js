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

const logger = require('log4js').getLogger('handle.group');

(() => {
  /**
   *
   */
  exports.search = function(send, msg){
    try{ var data = JSON.parse(msg);
    }catch(ex){ return; }

    try{ var group_info = JSON.parse(data.data);
    }catch(ex){ return; }

    biz.group.search(data.serverId, data.channelId, group_info)
    .then (p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };

  function p1(send, data, doc){
    var _data = [
      data.channelId,
      JSON.stringify([3002, doc, _.now(), data.seqId]),
    ];

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, err => {
      if(err) return logger.error('group search:', err);
    });
  }

  function p2(send, data, err){
    if('object'   === typeof err) return logger.error('group search:', err);
    if('invalid_user_id' === err) return logger.debug('group search:', err);

    var _data = [
      data.channelId,
      JSON.stringify([3002, , _.now(), data.seqId, err]),
    ];

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, err => {
      if(err) return logger.error('group search:', err);
    });
  }
})();

(() => {
  /**
   *
   */
  exports.re_entry = function(send, msg){
    try{ var data = JSON.parse(msg);
    }catch(ex){ return; }

    biz.group.re_entry(data.serverId, data.channelId)
    .then (p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };

  function p1(send, data, doc){
    if(!doc) return;

    var _data = [
      null,
      JSON.stringify([3004, doc[1], _.now(), data.seqId])
    ];

    for(let i of _.values(doc[0])){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, err => {
        if(err) return logger.error('group re_entry:', err);
      });
    }
  }

  function p2(send, data, err){
    if('object'   === typeof err) return logger.error('group re_entry:', err);
    if('invalid_user_id' === err) return logger.debug('group re_entry:', err);

    var _data = [
      data.channelId,
      JSON.stringify([3004, , _.now(), data.seqId, err]),
    ];

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, err => {
      if(err) return logger.error('group re_entry:', err);
    });
  }
})();


(() => {
  /**
   *
   * @return
   */
  exports.quit = function(send, msg){
    try{ var data = JSON.parse(msg);
    }catch(ex){ return; }

    biz.group.quit(data.serverId, data.channelId)
    .then (p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };

  function p1(send, data, doc){
    if(!doc) return;

    var _data = [
      null,
      JSON.stringify([3006, doc[1], _.now(), data.seqId]),
    ];

    for(let i of _.values(doc[0])){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, err => {
        if(err) return logger.error('group quit:', err);
      });
    }
  }

  function p2(send, data, err){
    if('object'   === typeof err) return logger.error('group quit:', err);
    if('invalid_user_id' === err) return logger.debug('group quit:', err);

    var _data = [
      data.channelId,
      JSON.stringify([3006, , _.now(), data.seqId, err]),
    ];

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, err => {
      if(err) return logger.error('group quit:', err);
    });
  }
})();

(() => {
  /**
   *
   */
  exports.entry = function(send, msg){
    try{ var data = JSON.parse(msg);
    }catch(ex){ return; }

    biz.group.entry(data.serverId, data.channelId, data.data)
    .then (p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };

  function p1(send, data, doc){
    if(!doc) return;

    var _data = [
      null,
      JSON.stringify([3008, doc[1], _.now(), data.seqId]),
    ];

    for(let i of _.values(doc[0])){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, err => {
        if(err) return logger.error('group entry:', err);
      });
    }
  }

  function p2(send, data, err){
    if('object'   === typeof err) return logger.error('group entry:', err);
    if('invalid_user_id' === err) return logger.debug('group entry:', err);

    var _data = [
      data.channelId,
      JSON.stringify([3008, , _.now(), data.seqId, err]),
    ];

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, err => {
      if(err) return logger.error('group entry:', err);
    });
  }
})();
