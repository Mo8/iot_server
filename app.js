var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cron = require("node-cron");

var indexRouter = require('./routes/index');
var getRouter = require('./routes/getConfig');
const mongoose = require('mongoose');
var app = express();

mongoose.connect('mongodb://root:example@localhost:27017/lorawan?authSource=admin');

const Data = mongoose.model('Data', { measures: { conduct_SOIL: Number, temp_SOIL: Number, water_SOIL: Number }, timestamp: {type:Date,unique:true}, },);



cron.schedule('0 */20 * * * *', async () => {
  console.log('cron data');
  var query;
  try{
    query = await Data.findOne({}, {}, { sort: { 'timestamp' : -1 } });
  }catch(e){
    console.log(e)
  }
  console.log("Get after : ",query != null ? new Date(query.timestamp.getTime() + 1) : new Date(Date.now() - (1000*60*60*24)));
  var query = await getRouter.getData(query != null ? new Date(query.timestamp.getTime() + 1) : new Date(Date.now() - (1000*60*60*24)));
  console.log(query.length);
  Data.create(query).then(()=> console.log("meow")).catch((r)=> console.error(r));  
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(getRouter.router)
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err.message);
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
