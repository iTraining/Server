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

// Redis stores session
var config = require('./config/config')
var expressSession = require('express-session');  // 该中间件使得req有session属性
var RedisStore = require('connect-redis')(expressSession);
var redisConfig=config.redisConfig
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
var auth = require('./controllers/auth')
app.use(auth.checkSession)

// 配置API路由
var routes = require('./routes');
app.use('/', routes);

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
