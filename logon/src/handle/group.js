/*!
 * emag.handle
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const path  = require('path');
const cwd   = process.cwd();
const conf  = require(path.join(cwd, 'settings'));

const biz    = require('emag.biz');
const cfg    = require('emag.cfg');

const logger = require('log4js').getLogger('handle.group');

const _ = require('underscore');

const roomPool = require('emag.model').roomPool;

(() => {
  function p1(send, data, user){
    if(!user) return;

    var _data = [];
    _data.push(user.channel_id);
    _data.push(JSON.stringify([3002, data.seqId, _.now(), user]));

    send('/queue/back.send.v3.'+ user.server_id, { priority: 9 }, _data, (err, code) => {
      if(err) return logger.error('group search:', err);
    });
  }

  function p2(send, data, err){
    if('string' !== typeof err) return logger.error('group search:', err);

    var _data = [];
    _data.push(data.channelId);
    _data.push(JSON.stringify([3002, data.seqId, _.now(), , err]));

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, (err, code) => {
      if(err) return logger.error('group search:', err);
    });
  }

  /**
   *
   */
  exports.search = function(send, msg){
    if(!_.isString(msg.body)) return logger.error('group search empty');

    try{ var data = JSON.parse(msg.body);
    }catch(ex){ return; }

    try{ var group_info = JSON.parse(data.data);
    }catch(ex){ return; }

    biz.group.search(data.serverId, data.channelId, group_info)
    .then(p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };
})();

(() => {
  function p1(send, data, user){
    if(!user) return;

    var room = roomPool.get(user.group_id);
    if(!room) return;
    if(0 === _.size(room.users)) return;

    var _data = [];
    _data.push(null);
    _data.push(JSON.stringify([3006, data.seqId, _.now(), user]));

    for(let i of _.values(room.users)){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, (err, code) => {
        if(err) return logger.error('group entry:', err);
      });
    }
  }

  function p2(send, data, err){
    if('string' !== typeof err) return logger.error('group quit:', err);

    var _data = [];
    _data.push(data.channelId);
    _data.push(JSON.stringify([3006, data.seqId, _.now(), , err]));

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, (err, code) => {
      if(err) return logger.error('group quit:', err);
    });
  }

  /**
   *
   */
  exports.quit = function(send, msg){
    if(!_.isString(msg.body)) return logger.error('group quit empty');

    try{ var data = JSON.parse(msg.body);
    }catch(ex){ return; }

    biz.group.quit(data.serverId, data.channelId)
    .then(p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };
})();

(() => {
  function p1(send, data, user){
    if(!user) return;

    var room = roomPool.get(user.group_id);
    if(!room) return;
    if(0 === _.size(room.users)) return;

    var _data = [];
    _data.push(null);
    _data.push(JSON.stringify([3008, data.seqId, _.now(), room.users]));

    for(let i of _.values(room.users)){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, (err, code) => {
        if(err) return logger.error('group entry:', err);
      });
    }
  }

  function p2(send, data, err){
    if('string' !== typeof err) return logger.error('group entry:', err);

    var _data = [];
    _data.push(data.channelId);
    _data.push(JSON.stringify([3008, data.seqId, _.now(), , err]));

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, (err, code) => {
      if(err) return logger.error('group entry:', err);
    });
  }

  /**
   *
   */
  exports.entry = function(send, msg){
    if(!_.isString(msg.body)) return logger.error('group entry empty');

    try{ var data = JSON.parse(msg.body);
    }catch(ex){ return; }

    biz.group.entry(data.serverId, data.channelId, data.data)
    .then(p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };
})();
