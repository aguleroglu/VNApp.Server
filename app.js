var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var mongoose = require('mongoose');
    // mongoose.Promise = global.Promise;
mongoose.connect('mongodb://vn-user:Password1@ds145118.mlab.com:45118/vn-app',function(err) 
{ 
  if (err) console.log(err); 
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var hurriyet = require('./modules/hurriyet.js');
var schedule = require('node-schedule');
var j = schedule.scheduleJob('* 10 * * *', function(){
  hurriyet.syncArticles();
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index');
var user = require('./api/user');
var speech = require('./api/speech');

app.use('/', routes);
app.use('/api/speech', speech);
app.use('/api/user', user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3001,function(){

  console.log("listening 3001");

})


module.exports = app;
