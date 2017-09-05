/*!
 * emag.model
 * Copyright(c) 2017 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var Room = function(opts){
  var self  = this;
  self.opts = opts;

  self.id   = opts.id;
  self.name = opts.name || ('Room '+ opts.id);

  self._users   = {};
  self._players = {};

  self._sum_user   = 10;
  self._sum_player = 4;

  self._free_seat = [1, 2, 3, 4];
};

var pro = Room.prototype;

/**
 *
 * @return
 */
pro.getUser = function(id){
  return this._users[id];
};

/**
 * 获取所有用户
 *
 * @return
 */
pro.getUsers = function(){
  return this._users;
};

/**
 * 房间满了吗？
 *
 * @return boolean
 */
pro.isFull = function(){
  return this._sum_player <= _.size(this._users);
};

(function(){
  /**
   * 进入群组
   *
   * @return
   */
  pro.entry = function(user){
    var self = this;

    if(self.getUser(user.id)) return '已经在房间内';
    if(self.isFull())         return '房间满员';

    user.opts = {};

    setSeat.call(self, user);

    self._users[user.id] = user;

    user.opts.score = 0;
    user.opts.entry_time = new Date().getTime();

    return user;
  };

  function setSeat(user){
    var seat_no = this._free_seat.shift();
    if(!seat_no) return;

    this._players[user.id] = user;
    user.opts.seat         = seat_no;
  }
})();