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

const logger = require('log4js').getLogger('handle');

const _  = require('underscore');
_.str    = require('underscore.string');
_.mixin(_.str.exports());

const roomPool = require('emag.model').roomPool;

/**
 *
 */
exports.one_for_one = function(send, msg){
  if(!_.isString(msg.body)) return logger.error('chat one_for_one empty');

  try{ var data = JSON.parse(msg.body);
  }catch(ex){ return; }

  var _data = [data.channelId, JSON.stringify([2002, , _.now(), data.data])];

  logger.debug('chat one_for_one: %j', _data);

  send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, (err, code) => {
    if(err) return logger.error('chat one_for_one:', err);
  });
};

(() => {
  function p1(send, data, user){
    if(!user) return;

    var room = roomPool.get(user.group_id);
    if(!room) return;
    if(0 === _.size(room.users)) return;

    var _data = [];
    _data.push(null);
    _data.push(JSON.stringify([2004, data.seqId, _.now(), [user.id, data.data]]));

    for(let i of _.values(room.users)){
      if(!i.server_id || !i.channel_id) continue;
      _data.splice(0, 1, i.channel_id);

      send('/queue/back.send.v3.'+ i.server_id, { priority: 9 }, _data, (err, code) => {
        if(err) return logger.error('group entry:', err);
      });
    }
  }

  function p2(send, data, err){
    if('string' !== typeof err) return logger.error('chat one_for_group:', err);

    var _data = [];
    _data.push(data.channelId);
    _data.push(JSON.stringify([2004, data.seqId, _.now(), , err]));

    send('/queue/back.send.v3.'+ data.serverId, { priority: 9 }, _data, (err, code) => {
      if(err) return logger.error('chat one_for_group:', err);
    });
  }

  /**
   *
   */
  exports.one_for_group = function(send, msg){
    if(!_.isString(msg.body)) return logger.error('chat one_for_group empty');

    try{ var data = JSON.parse(msg.body);
    }catch(ex){ return; }

    data.data = filter(data.data);
    if(!data.data) return;

    biz.user.getByChannelId(data.serverId, data.channelId)
    .then(p1.bind(null, send, data))
    .catch(p2.bind(null, send, data));
  };
})();

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
