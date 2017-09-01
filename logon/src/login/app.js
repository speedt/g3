/*!
 * emag.login
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const express = require('express'),
      flash = require('connect-flash'),
      velocity = require('velocityjs'),
      fs = require('fs'),
      http = require('http'),
      path = require('path'),
      cwd = process.cwd();

const conf = require('./settings');

const macro = require('emag.lib').macro;

const log4js = require('log4js');

log4js.configure({
  appenders: {
    app: {
      type: 'dateFile',
      filename: path.join(cwd, 'logs', 'app'),
      pattern: '.yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
    console: {
      type: 'console'
    }
  },
  categories: {
    default: {
      appenders: ['app', 'console'],
      level: 'debug'
    }
  }
});

const logger = log4js.getLogger('app');

const app = express();

/* all environments */
app.set('port', process.env.PORT || conf.app.port)
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'html')
   /* use */
   .use(flash())
   .use(express.favicon())
   .use(express.json())
   .use(express.urlencoded())
   .use(express.cookieParser())
   .use(express.methodOverride());

/* production */
if('production' === app.get('env')){
  app.use('/public', express.static(path.join(__dirname, 'public'), { maxAge: 10 * 1000 }))
     .use(express.errorHandler())
     .use(express.logger('dev'));
}

/* development */
if('development' === app.get('env')){
  app.use(express.logger('dev'))
     .use('/public', express.static(path.join(__dirname, 'public')))
     .use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
      }));
}

app.use(express.session({
  secret: conf.cookie.secret,
  key:    conf.cookie.key,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 1  //1 days
  }
}));

app.use(app.router)
    /* velocity */
   .engine('.html', (path, options, fn) => {
      fs.readFile(path, 'utf8', (err, data) => {
        if(err) return fn(err);
        try{ fn(null, velocity.render(data, options, macro)); }
        catch(ex){ fn(ex); }
      });
    });

app.use(function (err, req, res, next){
  if(!err) return next();
  if(req.xhr) return res.send({ error: { msg: err.message } });
  res.send(500, err.message);
});

var server = http.createServer(app);
/* server.setTimeout(5000); */
server.listen(app.get('port'), () => {
  logger.info('login server listening on port %s', app.get('port'));
  require('./routes')(app);
});

process.on('uncaughtException', err => {
  logger.error('uncaughtException:', err);
});

function exit(){ process.exit(0); }

process.on('SIGINT', exit);
process.on('SIGTERM', exit);
