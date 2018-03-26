const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongo = require('./mongo');
const session = require('express-session');

const app = express();

mongo.connect(error => {
	if (error) throw error;
});

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'hypertube',
	resave: false,
	saveUninitialized: true,
	cookie: {}
}))

app.use('/isUserLoggedIn', require('./routes/isUserLoggedIn'));

app.use('/login', require('./routes/login/'));
app.use('/login/resetPassword', require('./routes/login/resetPassword'));
app.use('/login/oauth/42', require('./routes/login/oauth/42'));
app.use('/login/oauth/Facebook', require('./routes/login/oauth/Facebook'));
app.use('/login/oauth/Google', require('./routes/login/oauth/Google'));

app.use('/signup', require('./routes/signup'));

app.use('/logout', require('./routes/logout'));

app.use('/home/getUserInfos', require('./routes/home/getUserInfos'));

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

//app.listen(3001);

module.exports = app;
