/*!
 * speedt-websocket
 * Copyright(c) 2017 speedt <13837186852@qq.com>
 * MIT Licensed
 */
'use strict';

(function(window){
  var root = window;
  var previousWebSocket = root.ws;

  var _ = function(obj){
    if(obj instanceof _) return obj;
    if(!(this instanceof _)) return new _(obj);
  };

  // nodejs
  if('undefined' !== typeof exports){
    if('undefined' !== typeof module && module.exports){
      exports = module.exports = _;
    }
    exports.ws = _;
  }else{
    root.ws = _;
  }

  _.connect = function(){
    // todo
  };

  _.noConflict = function(){
    root.ws = previousWebSocket;
    return this;
  };

  // amd
  if('function' === typeof define && define.amd){
    define('websocket', [], function(){
      return _;
    });
  }
})('undefined' === typeof window ? {} : window);