/*!
 * emag.model
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const path = require('path');
const cwd  = process.cwd();
const conf = require(path.join(cwd, 'settings'));

const _  = require('underscore');
_.str    = require('underscore.string');
_.mixin(_.str.exports());

var Room = require('./room');

const logger = require('log4js').getLogger('model.roomPool');

var res = module.exports = {};

var rooms = {};

res.create = function(room_info){
  if(!this.release(room_info.id)) return;

  var room = new Room(room_info);
  rooms[room.id] = room;
  return room;
};

res.release = function(id){
  var room = this.get(id);
  if(!room) return true;
  if(!room.release()) return false;
  return (delete rooms[id]);
};

res.get = function(id){
  return rooms[id];
}
