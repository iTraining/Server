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
app.use(express.static(path.join(__dirname, 'dist')));

// Mysql connection middleware
var mysql = require('mysql'),
    myConnection = require('express-myconnection'),
    dbOptions = {
      host: '127.0.0.1',
      user: 'root',
      password: 'password',
      database: 'itraining'
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


// TODO: make route
// controllers
// var createSession = require('./controllers/createSession');
// var createRestaurant = require('./controllers/createRestaurant');
// var getRestaurant = require('./controllers/getRestaurant');
var session = require('./controllers/session');

// routers
// router.post('/session', createSession);
// router.get('/restaurant', getRestaurant);
// router.post('/restaurant', createRestaurant);
router.get('/session', session.create);

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
