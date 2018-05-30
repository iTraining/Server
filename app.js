var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var stylus = require('stylus');
var router = express.Router();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));

// Mysql connection middleware
var mysql = require('mysql'),
    myConnection = require('express-myconnection'),
    dbOptions = {
      host: '127.0.0.1',
      user: 'root',
      password: 'password',
      database: 'itraining',
      multipleStatements: true
    };
app.use(myConnection(mysql, dbOptions, 'pool'));


// Redis stores session
var expressSession = require('express-session');  // 该中间件使得req有session属性
var RedisStore = require('connect-redis')(expressSession);
var redisConfig={
    'cookie' : {
       'maxAge' : 1800000  // 30 * 60 * 1000 ms = 30 mins
    },
    'sessionStore' : {
        'host' : '127.0.0.1',
        'port' : '6379',
        'db' : 1,
        'ttl' : 1800, // 60 * 30 sec = 30 mins
        'logErrors' : true
    }
}
app.use(expressSession({
    name : 'sid',
    secret : 'zhidan',
    resave : true,
    rolling: true,
    saveUninitialized : false,
    cookie : redisConfig.cookie,
    store : new RedisStore(redisConfig.sessionStore)
}));


// 检查是否有sessionid
app.use(function(req, res, next) {
  console.log('get request')
  if (req.path === '/session' || req.session.openid) {
    next();
  }
  else return res.status(401).json({
    code: 401,
    msg: '[Error] You have not sign in'
  })
})


// TODO: make route
// controllers
var session = require('./controllers/session');
var team = require('./controllers/team');
// routers
router.get('/session', session.create);
router.post('/team', team.create);

app.use(router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
