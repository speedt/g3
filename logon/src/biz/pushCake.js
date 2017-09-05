/*!
 * emag.biz
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const path = require('path');
const cwd  = process.cwd();
const conf = require(path.join(cwd, 'settings'));

const uuid = require('node-uuid');
const _    = require('underscore');

const md5   = require('speedt-utils').md5;
const utils = require('speedt-utils').utils;

const mysql = require('emag.db').mysql;
const redis = require('emag.db').redis;

const cfg = require('emag.cfg');
const biz = require('emag.biz');

const roomPool = require('emag.model').roomPool;

const logger = require('log4js').getLogger('biz.pushCake');

(() => {
  function p1(user){
    if(!user.group_id) return Promise.reject('已经退出了');

    var room = roomPool.get(user.group_id);
    if(!room) return Promise.reject('房间不存在');

    var _user = room.ready(user.id);

    if(!_user) return Promise.resolve();

    return Promise.resolve([
      room.users,
      [
        _user.id,
        _user.opts.seat,
        _.size(room.round_no_ready),
        room.id,
      ],
    ]);
  }

  /**
   * 准备
   *
   * @return
   */
  exports.ready = function(server_id, channel_id, next){
    return new Promise((resolve, reject) => {
      biz.user.getByChannelId(server_id, channel_id)
      .then(p1)
      .then(doc => {
        if(!doc) return;

        cb(doc[1][3], next);
        resolve(doc);
      })
      .catch(reject);
    });
  };

  /**
   * 10(s)
   *
   * @return
   */
  function cb(group_id, next){
    ((group_id, next) => {
      var room = roomPool.get(group_id);
      if(!room) return;  // 房间不存在
      if(!room.isStart()) return;

      (function schedule(second){
        second = 1000 * (second || 10);

        var timeout = setTimeout(function(){
          clearTimeout(timeout);

          if(!room) return;
          if(!room.act_status) return;

          if(5 === room.act_status){
            logger.debug('ready next: %s, %s', 3, group_id);

            var result = room.cardCompare();
            if(!result) return schedule(5);

            if(result === '5026'){
              next([room.users, room.round_no_compare, 5026]);
              return schedule(13);
            // }else if(result === '5028'){
            //   next([room.users, null, 5028]);
            //   return schedule(5);
            }else if(!!result){

              logger.debug(result);

              var group_id_1 = result[0];
              var round_id = result[5];
              var round_pno = result[6];
              var round_no = result[7];
              var user_id_a = result[1];
              var user_id_b = result[3];
              var seat_a = result[2];
              var seat_b = result[4];
              var gold_count_a = result[8];
              var gold_count_b = result[13];
              var score_a = result[9];
              var score_b = result[11];

              mysql.query('insert into g_group_balance (id, create_time, group_id, round_id, round_pno, round_no, user_id_a, user_id_b, seat_a, seat_b, gold_count_a, gold_count_b, score_a, score_b) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                  utils.replaceAll(uuid.v4(), '-', ''),
                  new Date(),
                  group_id_1,
                  round_id,
                  round_pno,
                  round_no,
                  user_id_a,
                  user_id_b,
                  seat_a,
                  seat_b,
                  gold_count_a,
                  gold_count_b,
                  score_a,
                  score_b,
                ], function (err){
                if(err) return logger.debug(err);

                mysql.query('update s_user set gold_count=? where id=?', [
                    gold_count_a,
                    user_id_a,
                  ], function (err){
                  if(err) return logger.debug(err);

                  mysql.query('update s_user set gold_count=? where id=?', [
                      gold_count_b,
                      user_id_b,
                    ], function (err){
                    if(err) return logger.debug(err);

                  });
                });
              });
            }

            next([room.users, result, 5024]);
            return schedule(5);

          }else if(9 === room.act_status){
            var result = room.roundReady();

            if('GAME_OVER' === result){
              return next([room.users, null, 5040]);
            }else if('ACT_STATUS_ROUND_NO_READY' === result){
              next([room.users, [room.round_pno, room.round_no], 5030]);
              return schedule(5);
            }
          // }else if(7 === room.act_status){

          //   var result = room.bankerGoOn();

          //   if('5038' === result){
          //     next([room.users, null, 5038]);
          //     return schedule(5);
          //   }else if('5028' === result){
          //     next([room.users, null, 5028]);
          //     return schedule(5);
          //   }else if('5034' === result){
          //     next([room.users, null, 5034]);
          //     return schedule(5);
          //   }

            return schedule(10);
          }else if(11 === room.act_status){
            room.cardCompareBefore();
            return schedule(6);
          }

          schedule();

        }, second);

      })();

    })(group_id, next);
  }
})();


(() => {
  function p1(user){
    if(!user.group_id) return Promise.reject('已经退出了');

    var room = roomPool.get(user.group_id);
    if(!room) return Promise.reject('房间不存在');

    var _user = room.craps4(user.id);

    if(!_user) return Promise.resolve();

    return Promise.resolve([
      room.users,
      [
        _user.id,
        _user.opts.seat,
        _user.opts.craps, // 当前摇的骰子
        room.act_seat,    // 下一个行动的座位
        room.banker_seat, // 庄家的座位
      ],
    ]);
  }

  /**
   * 4人摇骰子
   *
   * @return
   */
  exports.craps4 = function(server_id, channel_id, next){
    return new Promise((resolve, reject) => {
      biz.user.getByChannelId(server_id, channel_id)
      .then(p1)
      .then(doc => resolve(doc))
      .catch(reject);
    });
  };
})();


(() => {
  function p1(bet, user){
    if(!user.group_id) return Promise.reject('已经退出了');

    var room = roomPool.get(user.group_id);
    if(!room) return Promise.reject('房间不存在');

    var _user = room.bankerBet(user.id, bet);

    if(!_user) return Promise.resolve();

    return Promise.resolve([
      room.users,
      [
        _user.id,
        _user.opts.seat,
        room.act_seat,  // 下一个行动的座位
        _user.opts.bet,  // 庄家的锅底
      ],
    ]);
  }

  /**
   * 庄家下锅底
   *
   * @return
   */
  exports.bankerBet = function(server_id, channel_id, bet){
    bet -= 0;

    return new Promise((resolve, reject) => {
      biz.user.getByChannelId(server_id, channel_id)
      .then(p1.bind(null, bet))
      .then(doc => resolve(doc))
      .catch(reject);
    });
  };
})();


(() => {
  function p1(user){
    if(!user.group_id) return Promise.reject('已经退出了');

    var room = roomPool.get(user.group_id);
    if(!room) return Promise.reject('房间不存在');

    var _user = room.bankerCraps(user.id);

    if(!_user) return Promise.resolve();

    return Promise.resolve([
      room.users,
      [
        _user.id,
        _user.opts.seat,
        room.act_seat,     // 下一个行动的座位
        _user.opts.craps,  // 庄摇的骰子
        room.id,
      ],
    ]);
  }

  /**
   * 动作状态：庄家摇骰子，确定谁先起牌
   *
   * @return
   */
  exports.bankerCraps = function(server_id, channel_id, next){
    return new Promise((resolve, reject) => {
      biz.user.getByChannelId(server_id, channel_id)
      .then(p1)
      .then(doc => {
        if(!doc) return;

        cb(doc[1][4], next);
        resolve(doc);
      })
      .catch(reject);
    });
  };

  /**
   * 30(s)
   *
   * @return
   */
  function cb(group_id, next){
    setTimeout(() => {
      var room = roomPool.get(group_id);
      if(!room) return;  // 房间不存在

      var cards_8 = room.unBankerBetClosure();
      if(!cards_8) return;

      var users = [];

      for(let i of _.values(room.users)){
        users.push([
          i.id,
          i.opts.seat,
          i.opts.bet,
        ]);
      }

      next([
        room.users,
        [users, cards_8],
      ]);

    }, 15000);
  }
})();


(() => {
  function p1(bet, user){
    if(!user.group_id) return Promise.reject('已经退出了');

    var room = roomPool.get(user.group_id);
    if(!room) return Promise.reject('房间不存在');

    var _user = room.unBankerBet(user.id, bet);

    if(!_user) return Promise.resolve();

    return Promise.resolve([
      room.users,
      [
        _user.id,
        _user.opts.seat,
        _user.opts.bet,  // 闲家下的注
      ],
    ]);
  }

  /**
   * 动作状态：闲家下注
   *
   * @return
   */
  exports.unBankerBet = function(server_id, channel_id, bet){
    return new Promise((resolve, reject) => {
      biz.user.getByChannelId(server_id, channel_id)
      .then(p1.bind(null, bet))
      .then(doc => resolve(doc))
      .catch(reject);
    });
  };
})();


(() => {
  function p1(bet, user){
    if(!user.group_id) return Promise.reject('已经退出了');

    var room = roomPool.get(user.group_id);
    if(!room) return Promise.reject('房间不存在');

    var _user = room.bankerGoOn(user.id, bet);

    if(!_user) return Promise.resolve();

    logger.debug(_user);

    if('5038' === _user){

      return Promise.resolve([
        room.users,
        [
          5038,
          room.round_no_compare,
          room.banker_seat,
        ],
      ]);
    }else if('5034' === _user){
      
      return Promise.resolve([
        room.users,
        [
          5034,
          room.round_no_compare,
          room.banker_seat,
        ],
      ]);
    // }else if('5028' === _user){
      
    //   return Promise.resolve([
    //     room.users,
    //     [5028],
    //   ]);
    }else{

      logger.debug('10--------- %s', _user);

      // var aaa = room.round_no_compare[room.round_no_compare.length - 1];

      // return new Promise((resolve, reject) => {

      //     var group_id_1 = aaa[0];
      //     var round_id = aaa[5];
      //     var round_pno = aaa[6];
      //     var round_no = aaa[7];
      //     var user_id_a = aaa[1];
      //     var user_id_b = aaa[3];
      //     var seat_a = aaa[2];
      //     var seat_b = aaa[4];
      //     var gold_count_a = aaa[8];
      //     var gold_count_b = aaa[13];
      //     var score_a = aaa[9];
      //     var score_b = aaa[11];

      //     mysql.query('insert into g_group_balance (id, create_time, group_id, round_id, round_pno, round_no, user_id_a, user_id_b, seat_a, seat_b, gold_count_a, gold_count_b, score_a, score_b) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
      //         utils.replaceAll(uuid.v4(), '-', ''),
      //         new Date(),
      //         group_id_1,
      //         round_id,
      //         round_pno,
      //         round_no,
      //         user_id_a,
      //         user_id_b,
      //         seat_a,
      //         seat_b,
      //         gold_count_a,
      //         gold_count_b,
      //         score_a,
      //         score_b,
      //       ], function (err){
      //       if(err) return logger.debug(err);

      //       mysql.query('update s_user set gold_count=? where id=?', [
      //           gold_count_a,
      //           user_id_a,
      //         ], function (err){
      //         if(err) return logger.debug(err);

      //         mysql.query('update s_user set gold_count=? where id=?', [
      //             gold_count_b,
      //             user_id_b,
      //           ], function (err){
      //           if(err) return logger.debug(err);

      //           resolve([room.users, [5024, aaa, [
      //             _user.id,
      //             _user.opts.seat,
      //             _user.opts.bet,
      //             _user.opts.score,
      //             ]]]);
      //         });
      //       });
      //     });
      //   }

      // });


      return Promise.resolve([room.users, [5024, room.round_no_compare[room.round_no_compare.length - 1], [
        _user.id,
        _user.opts.seat,
        _user.opts.bet,
        _user.opts.score,
        ]]]);
      
      // return Promise.resolve([
      //   room.users,
      //   [
      //     0,
      //     _user.id,
      //     _user.opts.seat,
      //     _user.opts.bet,  // 闲家下的注
      //     _user.opts.score,  //　赔了之后剩下的钱
      //     room.round_no_compare[room.round_no_compare.length - 1],
      //   ],
      // ]);
    }

  }

  /**
   * 动作状态：闲家下注
   *
   * @return
   */
  exports.bankerGoOn = function(server_id, channel_id, bet){
    return new Promise((resolve, reject) => {
      biz.user.getByChannelId(server_id, channel_id)
      .then(p1.bind(null, bet))
      .then(doc => resolve(doc))
      .catch(reject);
    });
  };
})();

