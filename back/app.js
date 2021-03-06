const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongo = require('./mongo');
const session = require('express-session');
const initCron = require('./cron');

const app = express();

mongo.connect(error => {
	if (error) throw error;
});

initCron.initCron();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


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

app.use('/connect/login', require('./routes/connect/login'));
app.use('/connect/login/resetPassword', require('./routes/connect/login/resetPassword'));
app.use('/connect/login/oauth/42', require('./routes/connect/login/oauth/42'));
app.use('/connect/login/oauth/Facebook', require('./routes/connect/login/oauth/Facebook'));
app.use('/connect/login/oauth/Google', require('./routes/connect/login/oauth/Google'));

app.use('/connect/signup', require('./routes/connect/signup'));

app.use('/home/changeLanguage', require('./routes/home/changeLanguage'));

app.use('/home/logout', require('./routes/home/logout'));

app.use('/home/profile/getUserInfos', require('./routes/home/profile/getUserInfos'));
app.use('/home/profile/changeInfos', require('./routes/home/profile/changeInfos'));
app.use('/home/profile/changePassword', require('./routes/home/profile/changePassword'));
app.use('/home/profile/changePicture', require('./routes/home/profile/changePicture'));

app.use('/home/video/addComment', require('./routes/home/video/addComment'));
app.use('/home/video/getComments', require('./routes/home/video/getComments'));


app.use('/video', require('./routes/home/video/video'));

app.use('/sub', require('./routes/home/video/findSubtitles'));

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
