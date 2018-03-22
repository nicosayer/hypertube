const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongo = require('./mongo');

const app = express();

mongo.connect(error => {
	if (error) throw error;
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', require('./routes/login/'));
app.use('/resetPassword', require('./routes/login/resetPassword'));

app.use('/signup', require('./routes/signup/signup'));

app.use('/oauth/42', require('./routes/oauth/42'));
app.use('/oauth/Facebook', require('./routes/oauth/Facebook'));
app.use('/oauth/Google', require('./routes/oauth/Google'));

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

app.listen(3001);

module.exports = app;
