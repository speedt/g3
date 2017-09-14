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
  /**
   * 准备
   *
   * @return
   */
  exports.ready = function(server_id, channel_id, next){
    return new Promise((resolve, reject) => {
      biz.user.getByChannelId(server_id, channel_id)
      .then(p1.bind(null, next))
      .then(doc => resolve(doc))
      .catch(reject);
    });
  };

  function p1(next, user){
    if(!user.group_id) return Promise.reject('不在群组');

    var room = roomPool.get(user.group_id);
    if(!room) return Promise.reject('房间不存在');

    var _ready = room.ready(user.id);
    if('string' === typeof _ready) return Promise.reject(_ready);

    if(room.isStart()){
      cb(room.id, next);
    }

    return Promise.resolve(_ready);
  }

  function cb(group_id, next){
    (function schedule(second){
      second = 1000 * (second || 10);

      var timeout = setTimeout(function(){
        clearTimeout(timeout);

        var room = roomPool.get(group_id);
        if(!room) return;  // 房间不存在

        var delaytime=0;
        switch(room.act_status){
          case 'AS_WAIT_FOR_PLAYER_DICE':         next(room.timeOut_PlayerDice());     delaytime =10;     break;   //10s
          case 'AS_DELAY_PLAYER_DICE':            next(room.delay_PlayerDice());     delaytime =5;       break;    //5s
          case 'AS_WAIT_FOR_BANKER_BET':          next(room.timeOut_BankerBet());     delaytime =20;      break;      //20s
          case 'AS_DELAY_BANKER_BET':             next(room.delay_BankerBet());     delaytime =3;        break;      //3s
           case 'AS_WAIT_FOR_BANKER_CONTINUE_DICE':        
          case 'AS_WAIT_FOR_BANKER_DICE':         next(room.timeOut_BankerDice());     delaytime =10;     break;   //10s
          case 'AS_DELAY_BANKER_DICE':            next(room.delay_BankerDice());      delaytime =5;      break;     //5s
          case 'AS_WAIT_FOR_PLAYER_BET':          next(room.timeOut_PlayerBet_Finish());   delaytime =20; break;//20s
          case 'AS_DELAY_PLAYER_BET':             next(room.delay_PlayerBet());       delaytime =3;      break;      //3s
          case 'AS_DELAY_DEALCARD':               next(room.delay_DealCard());      delaytime =1;        break;      //5s\
          case 'AS_DELAY_COMPARE_CARD':           next(room.delay_ComepareCard());      delaytime =5;    break;     //5s
          case 'AS_DELAY_COMPARE_CARD2':          next(room.delay_ComepareCard2());     delaytime =5;    break;
          case 'AS_DELAY_COMPARE_CARD3':          next(room.delay_ComepareCard3());      delaytime =5;   break;
          case 'AS_WAIT_FOR_BANKER_CONTINUE_BET': next(room.timeOut_Banker_Continue_Bet());       delaytime =20;              break;
          case 'AS_DELAY_BANKER_CONTINUE_BET':    next(room.delay_BankerContinueBet());     delaytime =3;      break;
          case 'AS_WAIT_FOR_NEXT_ROUND':          next(room.timeOut_Next_Round(1));     delaytime =20;     break;
          case 'AS_WAIT_FOR_NEXT_ROUND2':          next(room.timeOut_Next_Round(2));     delaytime =20;     break;
          case 'AS_WAIT_FOR_BANKER_CONTINUE':      next(room.timeOut_Banker_Continue());   delaytime =20;   break;
          case 'AS_DELAY_NEXT_ROUND':              next(room.delay_NextRound());      delaytime =1;        break;
          case 'AS_GAMEOVER':                     next(room.gameOver()); break;
        }

        //schedule(delaytime);
        schedule(room.delaytime);
      }, second);
    })();
  }

  function a(){

  }
})();

(() => {
  function p1(user){
    if(!user.group_id) return Promise.reject('已经退出了');

    var room = roomPool.get(user.group_id);
    if(!room) return Promise.reject('房间不存在');

    var _craps4 = room.craps4(user.id);
    if('string' === typeof _craps4) return Promise.reject(_craps4);

    return Promise.resolve(_craps4);
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

    var _bankerBet = room.bankerBet(user.id, bet);
    if('string' === typeof _bankerBet) return Promise.reject(_bankerBet);

    return Promise.resolve(_bankerBet);
  }

  /**
   * 4人摇骰子
   *
   * @return
   */
  exports.bankerBet = function(server_id, channel_id, bet){
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

    var _bankerDice = room.bankerDice(user.id);
    if('string' === typeof _bankerDice) return Promise.reject(_bankerDice);

    return Promise.resolve(_bankerDice);
  }

  /**
   * 4人摇骰子
   *
   * @return
   */
  exports.bankerDice = function(server_id, channel_id){
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

    var _unBankerBet = room.unBankerBet(user.id, bet);
    if('string' === typeof _unBankerBet) return Promise.reject(_unBankerBet);

    return Promise.resolve(_unBankerBet);
  }

  /**
   * 4人摇骰子
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
  function p1(answer, user){
    if(!user.group_id) return Promise.reject('已经退出了');

    var room = roomPool.get(user.group_id);
    if(!room) return Promise.reject('房间不存在');

    var _bankerContinue = room.banker_Continue(user.id, answer);
    console.log(_bankerContinue)
    console.log('-----')
    if('string' === typeof _bankerContinue) return Promise.reject(_bankerContinue);

    return Promise.resolve(_bankerContinue);
  }

  /**
   * 4人摇骰子
   *
   * @return
   */
  exports.bankerContinue = function(server_id, channel_id, answer){
    return new Promise((resolve, reject) => {
      biz.user.getByChannelId(server_id, channel_id)
      .then(p1.bind(null, answer))
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

    var _bankerContinueBet = room.banker_Continue_Bet(user.id, bet);
    if('string' === typeof _bankerContinueBet) return Promise.reject(_bankerContinueBet);

    return Promise.resolve(_bankerContinueBet);
  }

  /**
   * 4人摇骰子
   *
   * @return
   */
  exports.bankerContinueBet = function(server_id, channel_id, bet){
    return new Promise((resolve, reject) => {
      biz.user.getByChannelId(server_id, channel_id)
      .then(p1.bind(null, bet))
      .then(doc => resolve(doc))
      .catch(reject);
    });
  };
})();
