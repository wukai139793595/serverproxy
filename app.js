var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var proxy = require('http-proxy-middleware');
var ejs = require('ejs');
var app = express();

// view engine setup
app.engine('html', ejs.__express);
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.set('view engine','html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static',express.static('public'));
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/index',proxy({target: 'http://dev-open.yunbisai.com/', changeOrigin: true}));
app.use(['/pay','/pollingPay'],proxy({target: 'http://dev-api.yunbisai.com/', changeOrigin: true}));
app.use('/', indexRouter);
app.use('/users', usersRouter);

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
