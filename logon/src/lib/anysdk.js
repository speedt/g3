/*!
 * emag.lib
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const path = require('path');
const cwd  = process.cwd();
const conf = require(path.join(cwd, 'settings'));

const crypto = require('crypto');

const http = require('http');
const ajax = require('speedt-utils').ajax;

(() => {
  /**
   *
   * @return
   */
  exports.payment = function(payInfo){
    return (check_sign(payInfo, conf.anysdk.private_key) && check_enhanced_sign(payInfo, conf.anysdk.enhanced_key));
  };

  // //anysdk privatekey
  // var private_key = 'E2D5511AFC845DDF8CE220ACE2A0A1C9';
  // //anysdk 增强密钥
  // var enhanced_key = 'OWE2ZmMyOGVmMWNhYzc0MmYyOWU';

  //md5
  var my_md5 = function(data){
    //中文字符处理
    data = new Buffer(data).toString("binary");
    return crypto.createHash('md5').update(data).digest('hex').toLowerCase();
  }

  //通用验签
  var check_sign = function(post,private_key){  
    var source_sign = post.sign;
    delete post.sign;
    var new_sign = get_sign(post,private_key);  
    
    if(source_sign == new_sign){
      return true;
    }
    return false;
  }

  //增强验签
  var check_enhanced_sign = function(post,enhanced_key){
    var source_enhanced_sign = post.enhanced_sign;
    delete post.enhanced_sign;
    delete post.sign;
    var new_sign = get_sign(post,enhanced_key);

    if(source_enhanced_sign == new_sign){
      return true;
    }
    return false; 
  }

  //获取签名
  var get_sign = function(post,sign_key){
    var keys = [];

    for(let key in post){
      // console.log("Key:"+key+"\tVaule:"+post[key]);
      keys.push(key);
      
    }
    keys = keys.sort();
    var paramString = '';
    for(let i in keys){
      paramString += post[keys[i]];
    }
    // console.log("拼接的字符串:"+paramString);
    // console.log("第一次md5:"+my_md5(paramString));
    // console.log("加入密钥:"+my_md5(paramString)+sign_key);
    // console.log("第二次md5:"+my_md5(my_md5(paramString)+sign_key));
    
    return  my_md5(my_md5(paramString)+sign_key);
  }
})();

(() => {
  exports.wx = function(query){
    query = query || {};
    return new Promise((resolve, reject) => {
      ajax(http.request, {
        host: 'oauth.anysdk.com',
        port: 80,
        path: '/api/User/LoginOauth/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
      }, query, null).then(html => {
        try{ var data = JSON.parse(html);
        }catch(ex){ return reject(ex); }
        if('ok' === data.status) return resolve(data);
        reject(data.data.error);
      }).catch(reject);
    });
  };
})();
