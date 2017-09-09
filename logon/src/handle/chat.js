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

const _  = require('underscore');
_.str    = require('underscore.string');
_.mixin(_.str.exports());

const roomPool = require('emag.model').roomPool;

const logger = require('log4js').getLogger('handle');

/**
 *
 * 信息过滤
 *
 * @return
 */
function filter(msg){
  if(!_.isString(msg)) return;
  return _.trim(msg);
}

/**
 *
 */
exports.one_for_one = function(send, msg){
  try{ var data = JSON.parse(msg);
  }catch(ex){ return; }

  var _data = [data.channelId, JSON.stringify([2002, data.data, _.now()])];

  send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, err => {
    if(err) return logger.error('chat one_for_one:', err);
  });
};

(() => {
  /**
   *
   */
  exports.one_for_group = function(send, msg){
    try{ var data = JSON.parse(msg);
    }catch(ex){ return; }

    data.data = filter(data.data);
    if(!data.data) return;

    biz.user.getByChannelId(data.serverId, data.channelId)
    .then (p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };

  function p1(send, data, user){
    if(!user.group_id) return;

    var room = roomPool.get(user.group_id);
    if(!room)          return;

    if(room.release()) return;

    var _data = [
      null,
      JSON.stringify([2004, [user.id, data.data], _.now(), data.seqId]),
    ];

    for(let i of _.values(room.getUsers())){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, (err, code) => {
        if(err) return logger.error('chat one_for_group:', err);
      });
    }
  }

  function p2(send, data, err){
    if('object' === typeof err) return logger.error('chat one_for_group:', err);
    logger.debug('chat one_for_group:', err);
  }
})();
