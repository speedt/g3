/*!
 * emag.biz
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const path = require('path');
const cwd  = process.cwd();
const conf = require(path.join(cwd, 'settings'));

const uuid  = require('node-uuid');

const md5   = require('speedt-utils').md5;
const utils = require('speedt-utils').utils;

const mysql = require('emag.db').mysql;
const redis = require('emag.db').redis;

const cfg = require('emag.cfg');
const biz = require('emag.biz');

const _  = require('underscore');
_.str    = require('underscore.string');
_.mixin(_.str.exports());

const logger = require('log4js').getLogger('biz.user');

(() => {
  /**
   *
   * @return
   */
  exports.payment = function(payInfo){
    return new Promise((resolve, reject) => {
      validate(payInfo)
      .then(formVali)
      .then(p1)
      .then(() => resolve())
      .catch(reject);
    });
  };

  function validate(payInfo){
    return Promise.resolve(payInfo);
  }

  function formVali(payInfo){
    payInfo.goods_id = payInfo.product_id;
    return Promise.resolve(payInfo);
  }

  function p1(payInfo){
    return new Promise((resolve, reject) => {
      mysql.beginTransaction()
      .then(p2.bind(null, payInfo))
      .then(() => resolve())
      .catch(reject);
    });
  }

  function p2(payInfo, trans){
    return new Promise((resolve, reject) => {
      biz.user_payment.saveNew(payInfo, trans)
      .then(p3.bind(null, payInfo, trans))
      .then(mysql.commitTransaction.bind(null, trans))
      .then(() => resolve())
      .catch(err => {
        trans.rollback(() => reject(err));
      })
    });
  }

  function p3(payInfo, trans){
    return new Promise((resolve, reject) => {
      biz.goods.findDetailById(payInfo.goods_id, trans)
      .then(biz.user.editPayment.bind(null, payInfo.user_id, trans))
      .then(() => resolve())
      .catch(reject);
    });
  }
})();

(() => {
  /**
   *
   * @return
   */
  exports.editPayment = function(id, trans, data){
    var _keys = process(data);

    var sql = 'UPDATE s_user SET ';
    sql += _keys[0];
    sql += ' WHERE id=?';

    var _params = _keys[1];
    _params.push(id);

    return new Promise((resolve, reject) => {
      (trans || mysql).query(sql, _params, err => {
        if(err) return reject(err);
        resolve();
      });
    });
  };

  function process(data){
    var _a = [], _b = [];

    for(let i of data){
      _a.push(getFieldName(i.game_prop_id) +'='+ getFieldName(i.game_prop_id) +'+?');
      _b.push(i.num);
    }

    return [_a.join(','), _b];
  }

  function getFieldName(field_no){
    switch(field_no){
      case '3': return 'current_score';
      case '4': return 'gold_count';
    }
  }
})();

(() => {
  var sql = 'SELECT a.* FROM s_user a WHERE a.status=? ORDER BY a.create_time DESC';

  exports.findAll = function(status, cb){
    mysql.query(sql, [status], cb);
  };
})();

(() => {
  /**
   * 并不是真删，而是改变状态
   *
   * @return
   */
  exports.del = function(id, cb){
    editStatus(id, 0, cb);
  };

  var sql = 'UPDATE s_user SET status=?, status_time=? WHERE id=?';

  function editStatus(id, status, cb){
    mysql.query(sql, [status, new Date(), id], cb);
  }
})();

(() => {
  var sql = 'UPDATE s_user SET user_pass=? WHERE id=?';

  /**
   * 重置密码
   *
   * @return
   */
  exports.resetPwd = function(id, user_pass, cb){
    mysql.query(sql, [md5.hex(user_pass || '123456'), id], cb)
  };
})();

(() => {
  /**
   * 用户退出
   *
   * @return
   */
  exports.logout = function(server_id, channel_id){
    return new Promise((resolve, reject) => {
      closeChannel(server_id, channel_id)
      .then(biz.group.quit.bind(null, server_id, channel_id))
      .then(doc => resolve(doc))
      .catch(reject);
    });
  };

  var sha1    = '3b248050f9965193d8a4836d6258861a1890017f';
  var numkeys = 3;

  function closeChannel(server_id, channel_id){
    return new Promise((resolve, reject) => {
      redis.evalsha(sha1, numkeys,
        conf.redis.database,  /**/
        server_id,            /**/
        channel_id,           /**/
        (err, code) => {
        if(err) return reject(err);
        if(!_.isArray(code)) return reject(code);
        resolve(utils.arrToObj(code));
      });
    });
  }
})();

(() => {
  function p1(logInfo, user){
    if(!user)             return Promise.reject('用户不存在');
    if(1 !== user.status) return Promise.reject('禁用状态');

    if(md5.hex(logInfo.user_pass) !== user.user_pass)
      return Promise.reject('用户名或密码输入错误');

    return new Promise((resolve, reject) => {
      Promise.all([
        authorize(user),
        biz.frontend.available(),
      ])
      .then(token => resolve(token))
      .catch(reject);
    });
  }

  var sha1    = '6a63911ac256b0c00cf270c6332119240d52b13e';
  var numkeys = 4;
  var seconds = 5;

  function authorize(user){
    return new Promise((resolve, reject) => {
      redis.evalsha(sha1, numkeys,
        conf.redis.database,                   /**/
        conf.app.client_id,                    /**/
        user.id,                               /**/
        utils.replaceAll(uuid.v4(), '-', ''),  /**/
        seconds, (err, code) => {
        if(err) return reject(err);
        resolve(code);
      });
    });
  }

  /**
   * 用户登陆
   *
   * @return
   */
  exports.login = function(logInfo /* 用户名及密码 */){
    return new Promise((resolve, reject) => {
      biz.user.getByName(logInfo.user_name)
      .then(p1.bind(null, logInfo))
      .then(token => resolve(token))
      .catch(reject);
    });
  };
})();

(() => {
  /**
   * 注册通道
   *
   * @return
   */
  exports.registerChannel = function(server_id, channel_id){
    return new Promise((resolve, reject) => {
      biz.user.getByRedisChannelId(server_id, channel_id)
      .then(editChannel)
      .then(user => resolve(user))
      .catch(reject);
    });
  };

  var sql = 'UPDATE s_user SET server_id=?, channel_id=? WHERE id=?';

  function editChannel(user_info, trans){
    return new Promise((resolve, reject) => {
      (trans || mysql).query(sql, [
        user_info.server_id,
        user_info.channel_id,
        user_info.id,
      ], err => {
        if(err) return reject(err);
        resolve(user_info);
      });
    });
  }

  /**
   * 清理通道
   *
   * @return
   */
  exports.clearChannel = function(id, trans){
    return editChannel({
      server_id:  '',
      channel_id: '',
      id:         id,
    }, trans);
  };
})();

(() => {
  var sql = 'SELECT a.* FROM s_user a WHERE a.id=?';

  /**
   * 获取用户
   *
   * @param id 用户id
   * @return
   */
  exports.getById = function(id, trans){
    return new Promise((resolve, reject) => {
      (trans || mysql).query(sql, [id], (err, docs) => {
        if(err) return reject(err);
        if(!mysql.checkOnly(docs)) return reject('用户不存在');
        resolve(docs[0]);
      });
    });
  };
})();

(() => {
  const numkeys = 3;
  const sha1    = '6df440fb93a747912f3eae2835c8fec8e90788ca';

  /**
  * 获取用户信息（user_info_byChannelId.lua）
  *
  * @return
  */
  exports.getByRedisChannelId = function(server_id, channel_id){
    return new Promise((resolve, reject) => {
      redis.evalsha(sha1, numkeys,
        conf.redis.database,  /**/
        server_id,            /**/
        channel_id,           /**/
        (err, code) => {
        if(err) return reject(err);
        if(!_.isArray(code)) return reject(code);
        resolve(utils.arrToObj(code));
      });
    });
  };
})();

(() => {
  var sql = 'UPDATE s_user SET nickname=?, current_score=?, vip=?, gold_count=gold_count+? WHERE id=?';

  /**
   * 基本信息修改
   *
   * @return
   */
  exports.editInfo = function(user_info, trans){
    user_info.current_score = user_info.current_score || 0;
    user_info.vip           = user_info.vip           || 0;
    user_info.gold_count    = user_info.gold_count    || 0;

    return new Promise((resolve, reject) => {
      (trans || mysql).query(sql, [
        user_info.nickname,
        user_info.current_score,
        user_info.vip,
        user_info.gold_count,
        user_info.id,
      ], err => {
        if(err) return reject(err);
        resolve(user_info);
      });
    });
  };
})();

(() => {
  // 2-10个字符，支持中文，英文大小写、数字、下划线
  var regex_user_name = /^[\u4E00-\u9FA5a-zA-Z0-9_]{2,10}$/;
  // 6-16个字符，支持英文大小写、数字、下划线，区分大小写
  var regex_user_pass = /^[a-zA-Z0-9_]{6,16}$/;

  /**
   * 用户注册
   *
   * @return
   */
  exports.register = function(user_info){
    user_info = user_info || {};

    if(!_.isString(user_info.user_name))
      return Promise.reject('INVALID_PARAMS');

    user_info.user_name = _.trim(user_info.user_name);

    if(!regex_user_name.test(user_info.user_name))
      return Promise.reject('INVALID_PARAMS');

    if(!_.isString(user_info.user_pass))
      return Promise.reject('INVALID_PARAMS');

    user_info.user_pass = _.trim(user_info.user_pass);

    if(!regex_user_pass.test(user_info.user_pass))
      return Promise.reject('INVALID_PARAMS');

    return new Promise((resolve, reject) => {
      biz.user.getByName(user_info.user_name)
      .then(p1)
      .then(p2.bind(null, user_info))
      .then(user_info => resolve(user_info))
      .catch(reject);
    });
  };

  function p1(user){
    if(user) return Promise.reject('用户名已存在');
    return Promise.resolve();
  }

  var sql = 'INSERT INTO s_user (id, user_name, user_pass, status, create_time, mobile, weixin, current_score, nickname, vip, consume_count, win_count, lose_count, win_score_count, lose_score_count, line_gone_count, gold_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  function p2(user_info){
    user_info.id               = utils.replaceAll(uuid.v1(), '-', '');
    user_info.user_pass        = md5.hex(user_info.user_pass);
    user_info.status           = 1;
    user_info.create_time      = new Date();
    user_info.current_score    = 0;
    user_info.nickname         = user_info.user_name;
    user_info.vip              = 0;
    user_info.consume_count    = 0;
    user_info.win_count        = 0;
    user_info.lose_count       = 0;
    user_info.win_score_count  = 0;
    user_info.lose_score_count = 0;
    user_info.line_gone_count  = 0;
    user_info.gold_count       = 0;  // 元宝

    return new Promise((resolve, reject) => {
      mysql.query(sql, [
        user_info.id,
        user_info.user_name,
        user_info.user_pass,
        user_info.status,
        user_info.create_time,
        user_info.mobile,
        user_info.weixin,
        user_info.current_score,
        user_info.nickname,
        user_info.vip,
        user_info.consume_count,
        user_info.win_count,
        user_info.lose_count,
        user_info.win_score_count,
        user_info.lose_score_count,
        user_info.line_gone_count,
        user_info.gold_count,
      ], err => {
        if(err) return reject(err);
        resolve(user_info);
      });
    });
  }
})();

(() => {
  var sql = 'SELECT a.* FROM s_user a WHERE a.user_name=?';

  /**
   *
   * @return
   */
  exports.getByName = function(user_name, trans){
    return new Promise((resolve, reject) => {
      (trans || mysql).query(sql, [user_name], (err, docs) => {
        if(err) return reject(err);
        resolve(mysql.checkOnly(docs) ? docs[0] : null);
      });
    });
  };
})();

(() => {
  /**
   * entry群组
   *
   * @return
   */
  exports.entryGroup = function(user_info, trans){
    return editGroup(user_info, trans);
  };

  /**
   * 创建群组
   *
   * @return
   */
  exports.createGroup = function(user_info, trans){
    return editGroup(user_info, trans);
  };

  var sql = 'UPDATE s_user SET backend_id=?, group_id=?, group_entry_time=? WHERE id=?';

  function editGroup(user_info, trans){
    user_info.group_entry_time = new Date().getTime();
    user_info.backend_id       = conf.app.id;

    return new Promise((resolve, reject) => {
      (trans || mysql).query(sql, [
        user_info.backend_id,
        user_info.group_id,
        user_info.group_entry_time,
        user_info.id,
      ], err => {
        if(err) return reject(err);
        resolve(user_info);
      })
    });
  }

  /**
   * 创建群组
   *
   * @return
   */
  exports.quitGroup = function(user_id, trans){
    return editGroup({
      group_id: '',
      id:       user_id,
    }, trans);
  };
})();

(() => {
  function p1(cb, trans){
    var id = _.random(100000, 999999);
    biz.user.findAllByGroupId(id, trans)
    .then(docs => {
      if(0 < docs.length) return p1(cb, trans);
      cb(null, id);
    })
    .catch(cb);
  }

  /**
   * 生成空闲的群组id
   *
   * @return
   */
  exports.genFreeGroupId = function(trans){
    return new Promise((resolve, reject) => {
      p1((err, id) => {
        if(err) return reject(err);
        resolve(id);
      }, trans);
    });
  };
})();

(() => {
  var sql = 'SELECT a.* FROM s_user a WHERE a.group_id=? ORDER BY a.group_entry_time ASC';

  /**
   * 获取群组的全部用户
   *
   * @param id 群组id
   * @return
   */
  exports.findAllByGroupId = function(id, trans){
    return new Promise((resolve, reject) => {
      (trans || mysql).query(sql, [id], (err, docs) => {
        if(err) return reject(err);
        resolve(docs);
      });
    });
  };
})();

(() => {
  var sql = 'SELECT a.* FROM s_user a WHERE a.server_id=? AND a.channel_id=?';

  /**
   * 获取用户
   *
   * @param server_id
   * @param channel_id
   * @return
   */
  exports.getByChannelId = function(server_id, channel_id){
    return new Promise((resolve, reject) => {
      mysql.query(sql, [server_id, channel_id], (err, docs) => {
        if(err) return reject(err);
        if(!mysql.checkOnly(docs)) return reject('通道不存在');
        resolve(docs[0]);
      });
    });
  };
})();
