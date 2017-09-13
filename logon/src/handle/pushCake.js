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

(() => {
  /**
   * 举手
   *
   * @return
   */
  exports.bankerDice = function(send, msg){
    try{ var data = JSON.parse(msg);
    }catch(ex){ return; }

    biz.pushCake.bankerDice(data.serverId, data.channelId)
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
        if(err) return logger.error('pushCake bankerDice:', err);
      });
    }
  }

  function p2(send, data, err){
    if('object'   === typeof err) return logger.error('pushCake bankerDice:', err);
    if('invalid_user_id' === err) return logger.debug('pushCake bankerDice:', err);

    var _data = [
      data.channelId,
      JSON.stringify([5002, , _.now(), data.seqId, err]),
    ];

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, err => {
      if(err) return logger.error('pushCake bankerDice:', err);
    });
  }
})();

(() => {
  /**
   * 举手
   *
   * @return
   */
  exports.unBankerBet = function(send, msg){
    try{ var data = JSON.parse(msg);
    }catch(ex){ return; }

    try{ var bet = JSON.parse(data.data);
    }catch(ex){ return; }

    biz.pushCake.unBankerBet(data.serverId, data.channelId, bet)
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
        if(err) return logger.error('pushCake unBankerBet:', err);
      });
    }
  }

  function p2(send, data, err){
    if('object'   === typeof err) return logger.error('pushCake unBankerBet:', err);
    if('invalid_user_id' === err) return logger.debug('pushCake unBankerBet:', err);

    var _data = [
      data.channelId,
      JSON.stringify([5002, , _.now(), data.seqId, err]),
    ];

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, err => {
      if(err) return logger.error('pushCake unBankerBet:', err);
    });
  }
})();

(() => {
  /**
   * 举手
   *
   * @return
   */
  exports.bankerContinue = function(send, msg){
    try{ var data = JSON.parse(msg);
    }catch(ex){ return; }

    console.log(data)

    biz.pushCake.bankerContinue(data.serverId, data.channelId, data.data)
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
        if(err) return logger.error('pushCake bankerContinue:', err);
      });
    }
  }

  function p2(send, data, err){
    if('object'   === typeof err) return logger.error('pushCake bankerContinue:', err);
    if('invalid_user_id' === err) return logger.debug('pushCake bankerContinue:', err);

    var _data = [
      data.channelId,
      JSON.stringify([5002, , _.now(), data.seqId, err]),
    ];

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, err => {
      if(err) return logger.error('pushCake bankerContinue:', err);
    });
  }
})();

(() => {
  /**
   * 举手
   *
   * @return
   */
  exports.bankerContinueBet = function(send, msg){
    try{ var data = JSON.parse(msg);
    }catch(ex){ return; }

    console.log(msg)

    biz.pushCake.bankerContinueBet(data.serverId, data.channelId, data.data)
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
        if(err) return logger.error('pushCake bankerContinueBet:', err);
      });
    }
  }

  function p2(send, data, err){
    if('object'   === typeof err) return logger.error('pushCake bankerContinueBet:', err);
    if('invalid_user_id' === err) return logger.debug('pushCake bankerContinueBet:', err);

    var _data = [
      data.channelId,
      JSON.stringify([5002, , _.now(), data.seqId, err]),
    ];

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, err => {
      if(err) return logger.error('pushCake bankerContinueBet:', err);
    });
  }
})();
