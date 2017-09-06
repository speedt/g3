/*!
 * emag.model
 * Copyright(c) 2017 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const DIRECTION_CLOCKWISE     = 1;  // 顺时针
const DIRECTION_ANTICLOCKWISE = 0;  // 逆时针

const ACT_STATUS_READY  = 0;  // 动作：举手
const ACT_STATUS_CRAPS4 = 1;  // 动作：

var Room = function(opts){
  var self  = this;
  self.opts = opts;

  self.id   = opts.id;
  self.name = opts.name || ('Room '+ opts.id);

  self._users = {};

  self.create_user_id = opts.user_id;
  self.create_time    = new Date().getTime();

  self.act_seat       = 1;
  self.act_status     = ACT_STATUS_READY;
  self._act_direction = DIRECTION_CLOCKWISE;

  self._free_seat    = [1, 2, 3, 4];
  self._player_count = self._free_seat.length;

  self.visitor_count = self.visitor_count || 0;  // 游客人数
  self.fund          = opts.fund          || 1000;
  self.round_count   = opts.round_count   || 4;
};

var pro = Room.prototype;

/**
 * 生成36
 *
 * @return
 */
function genCards(num){
  num = num || 36;

  var cards = [];
  var p     = 1;

  for(let i = 0; i < num; i += 4){
    cards[i] = cards[i + 1] = cards[i + 2] = cards[i + 3] = p++;
  }

  var max = num - 1;

  for(let i = 0; i < num; i++){
    let r        = Math.round(Math.random() * max);
    p            = cards[r];
    cards[r]     = cards[max];
    cards[max--] = p;
  }

  return cards;
}

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

pro.getPlayers = function(){
  var _players = {};

  for(let i of _.values(this._users)){
    if(0 < i.opts.seat) _players[i.opts.seat] = i;
  }

  return _players;
};

/**
 * 判断是否是
 *
 * @return
 */
pro.isPlayer = function(user_id){
  var user = this.getUser(user_id);
  if(!user) return;
  return 0 < user.opts.seat;
};

pro.isReady = function(user_id){
  var user = this.getUser(user_id);
  if(!user) return;
  return 0 < user.opts.ready;
};

/**
 * 判断是否游戏是否开始
 *
 * @return
 */
pro.isStart = function(){
  return this._player_count <= this.getReadyCount();
};

/**
 * 获取举手人数
 *
 * @return
 */
pro.getReadyCount = function(){
  var count = 0;

  for(let i of _.values(this._users)){
    if(0 < i.opts.ready) ++count;
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
  return (this._player_count + self.visitor_count) <= _.size(this._users);
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

  if(self.isStart() && self.isPlayer(user_id)){
    user.opts.quit_time = new Date().getTime();
    user.opts.is_quit   = 1;
    return false;
  }

  if(self.isPlayer(user_id)){
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

  if(self.act_status !== ACT_STATUS_READY) return;  // 举手时间
  if(self.isStart())                       return '已经开始';

  var user = self.getUser(user_id);
  if(!user)                   return '用户不存在';
  if(!self.isPlayer(user_id)) return '不能举手';
  if(!self.isReady (user_id)) return '已经举手';

  user.opts.ready = 1;

  if(self.isStart()){
    self.act_status = ACT_STATUS_CRAPS4;
    self.act_seat   = self.banker_seat || 1;
    self._cards_36  = genCards();
  }

  return user;
};

/**
 *
 * @return
 */
pro.re_entry = function(user){
  var _user = this.getUser(user.id);
  if(!_user)                   return;
  if(!this.isPlayer(_user.id)) return;
  if(1 > _user.opts.is_quit)   return;

  _user.opts.re_entry_time = new Date().getTime();
  _user.opts.is_quit       = 0;

  _user.server_id  = user.server_id;
  _user.channel_id = user.channel_id;

  return _user;
}
