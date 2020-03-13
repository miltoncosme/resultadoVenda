var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var FinalizadoraRouter = require('./routes/finalizadora');
var VendasRouter = require('./routes/vendas');
var LoginRouter = require('./routes/login');
const session = require("express-session");
const flash = require("connect-flash");
var app = express();
const passport = require("passport");
require("./config/auth")(passport);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(session({
  secret:process.env.SECRET_WEB,
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', indexRouter);
app.use('/finalizadora', FinalizadoraRouter);
app.use('/vendas', VendasRouter);
app.use('/login', LoginRouter);
app.use('/api', require('./routes/api'));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

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
