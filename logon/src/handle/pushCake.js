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
   * 举手
   *
   * @return
   */
  exports.ready = function(send, msg){
    try{ var data = JSON.parse(msg);
    }catch(ex){ return; }

    biz.pushCake.ready(data.serverId, data.channelId)
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

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, (err, code) => {
        if(err) return logger.error('channel ready:', err);
      });
    }
  }

  function p2(send, data, err){
    if('object'   === typeof err) return logger.error('channel ready:', err);
    if('invalid_user_id' === err) return logger.debug('channel ready:', err);

    var _data = [
      data.channelId,
      JSON.stringify([5002, , _.now(), data.seqId, err]),
    ];

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, err => {
      if(err) return logger.error('channel ready:', err);
    });
  }
})();
