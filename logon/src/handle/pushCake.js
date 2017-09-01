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

const logger = require('log4js').getLogger('handle.pushCake');

const _ = require('underscore');

const roomPool = require('emag.model').roomPool;

(() => {
  function p1(send, data, user){
    if(!user) return;

    var room = roomPool.get(user.group_id);
    if(!room) return;
    if(0 === _.size(room.users)) return;

    var _data = [];
    _data.push(null);
    _data.push(JSON.stringify([5006, data.seqId, _.now(), room]));

    for(let i of _.values(room.users)){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, (err, code) => {
        if(err) return logger.error('pushCake ready:', err);
      });
    }
  }

  function p2(send, data, err){
    if('string' !== typeof err) return logger.error('pushCake ready:', err);

    var _data = [];
    _data.push(data.channelId);
    _data.push(JSON.stringify([5006, data.seqId, _.now(), , err]));

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, (err, code) => {
      if(err) return logger.error('pushCake ready:', err);
    });
  }

  /**
   *
   */
  exports.ready = function(send, msg){
    if(!_.isString(msg.body)) return logger.error('pushCake ready empty');

    try{ var data = JSON.parse(msg.body);
    }catch(ex){ return; }

    biz.pushCake.ready(data.serverId, data.channelId)
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
    _data.push(JSON.stringify([5014, data.seqId, _.now(), room]));

    for(let i of _.values(room.users)){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, (err, code) => {
        if(err) return logger.error('pushCake craps:', err);
      });
    }
  }

  function p2(send, data, err){
    if('string' !== typeof err) return logger.error('pushCake craps:', err);

    var _data = [];
    _data.push(data.channelId);
    _data.push(JSON.stringify([5014, data.seqId, _.now(), , err]));

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, (err, code) => {
      if(err) return logger.error('pushCake craps:', err);
    });
  }

  /**
   *
   */
  exports.craps = function(send, msg){
    if(!_.isString(msg.body)) return logger.error('pushCake craps empty');

    try{ var data = JSON.parse(msg.body);
    }catch(ex){ return; }

    biz.pushCake.craps(data.serverId, data.channelId)
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
    _data.push(JSON.stringify([5016, data.seqId, _.now(), room]));

    for(let i of _.values(room.users)){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, (err, code) => {
        if(err) return logger.error('pushCake crapsBanker:', err);
      });
    }
  }

  function p2(send, data, err){
    if('string' !== typeof err) return logger.error('pushCake crapsBanker:', err);

    var _data = [];
    _data.push(data.channelId);
    _data.push(JSON.stringify([5016, data.seqId, _.now(), , err]));

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, (err, code) => {
      if(err) return logger.error('pushCake crapsBanker:', err);
    });
  }

  /**
   *
   */
  exports.crapsBanker = function(send, msg){
    if(!_.isString(msg.body)) return logger.error('pushCake crapsBanker empty');

    try{ var data = JSON.parse(msg.body);
    }catch(ex){ return; }

    biz.pushCake.crapsBanker(data.serverId, data.channelId)
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
    _data.push(JSON.stringify([5018, data.seqId, _.now(), room]));

    for(let i of _.values(room.users)){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, (err, code) => {
        if(err) return logger.error('pushCake bankerBet:', err);
      });
    }
  }

  function p2(send, data, err){
    if('string' !== typeof err) return logger.error('pushCake bankerBet:', err);

    var _data = [];
    _data.push(data.channelId);
    _data.push(JSON.stringify([5018, data.seqId, _.now(), , err]));

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, (err, code) => {
      if(err) return logger.error('pushCake bankerBet:', err);
    });
  }

  /**
   *
   */
  exports.bankerBet = function(send, msg){
    if(!_.isString(msg.body)) return logger.error('pushCake bankerBet empty');

    try{ var data = JSON.parse(msg.body);
    }catch(ex){ return; }

    console.log(data)

    biz.pushCake.bankerBet(data.serverId, data.channelId, data.data)
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
    _data.push(JSON.stringify([5020, data.seqId, _.now(), room]));

    for(let i of _.values(room.users)){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, (err, code) => {
        if(err) return logger.error('pushCake noBankerBet:', err);
      });
    }
  }

  function p2(send, data, err){
    if('string' !== typeof err) return logger.error('pushCake noBankerBet:', err);

    var _data = [];
    _data.push(data.channelId);
    _data.push(JSON.stringify([5020, data.seqId, _.now(), , err]));

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, (err, code) => {
      if(err) return logger.error('pushCake noBankerBet:', err);
    });
  }

  /**
   *
   */
  exports.noBankerBet = function(send, msg){
    if(!_.isString(msg.body)) return logger.error('pushCake noBankerBet empty');

    try{ var data = JSON.parse(msg.body);
    }catch(ex){ return; }

    biz.pushCake.noBankerBet(data.serverId, data.channelId, data.data, next.bind(null, send, data))
    .then(p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };

  function next(send, data, user){
    if(!user) return;

    var room = roomPool.get(user.group_id);
    if(!room) return;
    if(0 === _.size(room.users)) return;

    var _data = [];
    _data.push(null);
    _data.push(JSON.stringify([5022, data.seqId, _.now(), room]));

    for(let i of _.values(room.users)){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, (err, code) => {
        if(err) return logger.error('pushCake noBankerBet:', err);
      });
    }
  }
})();
