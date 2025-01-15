var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//cors
const cors = require("cors");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//permisos de cors
app.use(
  cors({origin: "*"})
);

app.use('/', indexRouter);
app.use('/api', usersRouter);

// syn models
const modelsPromise = require('./models');

modelsPromise
  .then((models) => {
    console.log("Database synced successfully");

    models.sequelize.sync()
      .then(() => {
        console.log("Models synced successfully");
        // Your application logic here
      })
      .catch((error) => {
        console.error("Error syncing models:", error);
      });
  })
  .catch((error) => {
    console.error("Error initializing database:", error);
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