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
  /**
   * 举手
   *
   * @return
   */
  exports.ready = function(send, msg){
    if(!_.isString(msg.body)) return logger.error('channel ready empty');

    try{ var data = JSON.parse(msg.body);
    }catch(ex){ return; }

    biz.pushCake.ready(data.serverId, data.channelId, next.bind(null, send, data))
    .then (p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };

  function p1(send, data, doc){
    if(!doc) return;

    var _data = [];
    _data.push(null);
    _data.push(JSON.stringify([3012, data.seqId, _.now(), doc[1]]));

    for(let i of _.values(doc[0])){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, (err, code) => {
        if(err) return logger.error('channel ready:', err);
      });
    }
  }

  function p2(send, data, err){
    if('string' !== typeof err) return logger.error('channel ready:', err);

    var _data = [];
    _data.push(data.channelId);
    _data.push(JSON.stringify([3012, data.seqId, _.now(), , err]));

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, (err, code) => {
      if(err) return logger.error('channel ready:', err);
    });
  }

  function next(send, data, doc){
    if(!doc) return;

    var _data = [];
    _data.push(null);
    _data.push(JSON.stringify([doc[2], data.seqId, _.now(), doc[1]]));

    for(let i of _.values(doc[0])){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, (err, code) => {
        if(err) return logger.error('channel ready '+ doc[2] +':', err);
      });
    }
  }
})();

(() => {
  /**
   *
   */
  exports.craps4 = function(send, msg){
    if(!_.isString(msg.body)) return logger.error('pushCake craps4 empty');

    try{ var data = JSON.parse(msg.body);
    }catch(ex){ return; }

    biz.pushCake.craps4(data.serverId, data.channelId)
    .then (p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };

  function p1(send, data, doc){
    if(!doc) return;

    var _data = [];
    _data.push(null);
    _data.push(JSON.stringify([5014, data.seqId, _.now(), doc[1]]));

    for(let i of _.values(doc[0])){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, (err, code) => {
        if(err) return logger.error('pushCake craps4:', err);
      });
    }
  }

  function p2(send, data, err){
    if('string' !== typeof err) return logger.error('pushCake craps4:', err);

    var _data = [];
    _data.push(data.channelId);
    _data.push(JSON.stringify([5014, data.seqId, _.now(), , err]));

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, (err, code) => {
      if(err) return logger.error('pushCake craps4:', err);
    });
  }
})();


(() => {
  /**
   *
   */
  exports.bankerBet = function(send, msg){
    if(!_.isString(msg.body)) return logger.error('pushCake bankerBet empty');

    try{ var data = JSON.parse(msg.body);
    }catch(ex){ return; }

    biz.pushCake.bankerBet(data.serverId, data.channelId, data.data)
    .then (p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };

  function p1(send, data, doc){
    if(!doc) return;

    var _data = [];
    _data.push(null);
    _data.push(JSON.stringify([5018, data.seqId, _.now(), doc[1]]));

    for(let i of _.values(doc[0])){
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
})();


(() => {
  /**
   *
   */
  exports.bankerCraps = function(send, msg){
    if(!_.isString(msg.body)) return logger.error('pushCake bankerCraps empty');

    try{ var data = JSON.parse(msg.body);
    }catch(ex){ return; }

    biz.pushCake.bankerCraps(data.serverId, data.channelId, next.bind(null, send, data))
    .then (p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };

  function p1(send, data, doc){
    if(!doc) return;

    var _data = [];
    _data.push(null);
    _data.push(JSON.stringify([5016, data.seqId, _.now(), doc[1]]));

    for(let i of _.values(doc[0])){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, (err, code) => {
        if(err) return logger.error('pushCake bankerCraps:', err);
      });
    }
  }

  function p2(send, data, err){
    if('string' !== typeof err) return logger.error('pushCake bankerCraps:', err);

    var _data = [];
    _data.push(data.channelId);
    _data.push(JSON.stringify([5016, data.seqId, _.now(), , err]));

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, (err, code) => {
      if(err) return logger.error('pushCake bankerCraps:', err);
    });
  }

  function next(send, data, doc){
    if(!doc) return;

    var _data = [];
    _data.push(null);
    _data.push(JSON.stringify([5022, data.seqId, _.now(), doc[1]]));

    for(let i of _.values(doc[0])){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, (err, code) => {
        if(err) return logger.error('pushCake unBankerBetClosure:', err);
      });
    }
  }
})();


(() => {
  /**
   *
   */
  exports.unBankerBet = function(send, msg){
    if(!_.isString(msg.body)) return logger.error('pushCake unBankerBet empty');

    try{ var data = JSON.parse(msg.body);
    }catch(ex){ return; }

    biz.pushCake.unBankerBet(data.serverId, data.channelId, data.data)
    .then (p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };

  function p1(send, data, doc){
    if(!doc) return;

    var _data = [];
    _data.push(null);
    _data.push(JSON.stringify([5020, data.seqId, _.now(), doc[1]]));

    for(let i of _.values(doc[0])){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, (err, code) => {
        if(err) return logger.error('pushCake unBankerBet:', err);
      });
    }
  }

  function p2(send, data, err){
    if('string' !== typeof err) return logger.error('pushCake unBankerBet:', err);

    var _data = [];
    _data.push(data.channelId);
    _data.push(JSON.stringify([5020, data.seqId, _.now(), , err]));

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, (err, code) => {
      if(err) return logger.error('pushCake unBankerBet:', err);
    });
  }
})();


(() => {
  /**
   *
   */
  exports.bankerGoOn = function(send, msg){
    if(!_.isString(msg.body)) return logger.error('pushCake bankerGoOn empty');

    try{ var data = JSON.parse(msg.body);
    }catch(ex){ return; }

    biz.pushCake.bankerGoOn(data.serverId, data.channelId, data.data)
    .then (p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };

  function p1(send, data, doc){
    if(!doc) return;

    var _data = [];
    _data.push(null);
    _data.push(JSON.stringify([5072, data.seqId, _.now(), doc[1]]));

    for(let i of _.values(doc[0])){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, (err, code) => {
        if(err) return logger.error('pushCake bankerGoOn:', err);
      });
    }
  }

  function p2(send, data, err){
    if('string' !== typeof err) return logger.error('pushCake bankerGoOn:', err);

    var _data = [];
    _data.push(data.channelId);
    _data.push(JSON.stringify([5072, data.seqId, _.now(), , err]));

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, (err, code) => {
      if(err) return logger.error('pushCake bankerGoOn:', err);
    });
  }
})();

