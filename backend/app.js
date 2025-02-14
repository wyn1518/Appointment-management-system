

require('dotenv').config()
const createError = require('http-errors');
// import express from 'express';

const favicon = require('serve-favicon')
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const app = module.exports = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MIDDLEwWARE

app.use(favicon(path.join(__dirname, 'public','images', 'favicon.ico')))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie : {
    maxAge:60000 * 60 * 24,
  }
  
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use('/',require('./routes/auth'));

app.post('/admin/images/upload',require('./middleware/upload'));


app.set('muba',{
  permissions:{
    '*:setting':{
      description:'Update setting',
    },
    '*:users':{
      description:'Can manage users.'
    },
    '*:roles':{
      description:'Can manage roles.'
    },
    '*:appointments':{
      description:'Can manage appointments.'
    },
    '*:schedules':{
      description:'Can manage schedules.'
    },
    '*:images':{
      description:'Can manage images.'
    },
  }
})

app.use('/',require('./routes/session'));
app.use('/', require('./routes/index'));
app.use('/',require("./routes/visitor/appointment"));
app.use('/admin',require("./routes/admin/users"));


app.use('/admin',require("./routes/admin/dashboard"));
app.use('/admin',require("./routes/admin/roles"));
app.use('/admin',require("./routes/admin/image"));
app.use('/admin',require("./routes/admin/appointment"));



app.get('*',function(req,res,next){
  next(createError(404,'page not found'))
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.error(err);
  res.status(err.status || 500);
  res.render('error');
});
