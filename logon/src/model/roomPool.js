/*!
 * emag.model
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const path = require('path');
const cwd  = process.cwd();
const conf = require(path.join(cwd, 'settings'));

const uuid = require('node-uuid');

const cfg = require('emag.cfg');
const biz = require('emag.biz');

const _  = require('underscore');
_.str    = require('underscore.string');
_.mixin(_.str.exports());

var Room = require('./room');

const logger = require('log4js').getLogger('model.roomPool');

var res = module.exports = {};

var rooms = {};

res.create = function(room_info){
  if(!room_info) return;
  if(!room_info.id) return;
  if(rooms[room_info.id]) return;

  var room = new Room(room_info);
  rooms[room.id] = room;
  return room;
};

res.release = function(id){
  var room = rooms[id];
  if(!room) return true;
  if(!room.release()) return false;
  delete rooms[id];
  return true;
};

res.get = function(id){
  return rooms[id];
}
