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

  self._free_seat = [1, 2, 3, 4];

  self.visitor_count = self.visitor_count || 6;     // 游客人数
  self.fund          = opts.fund          || 1000;  // 组局基金
  self.round_count   = opts.round_count   || 4;     // 圈数
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
 * 判断是否是玩家
 *
 * @return
 */
pro.isPlayer = function(user_id){
  var user = this.getUser(user_id);
  if(!user) return;
  return 0 < user.opts.seat;
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
 * 判断是否游戏是否开始
 *
 * @return
 */
pro.isStart = function(){
  return this._free_seat.length <= this.getReadyCount();
};

/**
 * 获取举手人数
 *
 * @return
 */
pro.getReadyCount = function(){
  var count = 0;

  for(let i of _.values(this._players)){
    if(!!i.opts.ready) ++count;
  }

  return count;
};

/**
 *
 * @return
 */
pro.release = function(){
  return 1 > _.size(this._users);
};

/**
 * 房间满了吗？
 *
 * @return boolean
 */
pro.isFull = function(){
  return (this._free_seat.length + self.visitor_count) <= _.size(this._users);
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

    user.opts.score      = 0;
    user.opts.entry_time = new Date().getTime();

    return user;
  };

  function setSeat(user){
    var seat_no = this._free_seat.shift();
    if(!(0 < seat_no)) return;

    this._players[seat_no] = user;
    user.opts.seat         = seat_no;
  }
})();

/**
 * 退出群组
 *
 * @return
 */
pro.quit = function(user_id){
  var self = this;

  var user = self.getUser(user_id);
  if(!user) return true;

  if(self.isStart() && (0 < user.opts.seat)){
    user.opts.quit_time = new Date().getTime();
    user.opts.is_quit   = 1;
    return false;
  }

  if(0 < user.opts.seat){
    self._free_seat.push(user.opts.seat);
    delete self._players[user.opts.seat];
  }

  return (delete self._users[user_id]);
};

/**
 *
 * @return
 */
pro.ready = function(user_id){
  var self = this;

  if(self.isStart())     return '已经开始';

  var user = self.getUser(user_id);
  if(!user)               return '用户不存在';
  if(1 > user.opts.seat)  return '不能举手';
  if(0 < user.opts.ready) return '已经举手';

  user.opts.ready = 1;

  return user;
};
