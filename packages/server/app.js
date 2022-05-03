var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var utils = require("./utils/utils");
var jwt = require("./utils/token");

// var cookieParser = require('cookie-parser');
// var session = require("express-session");

var indexRouter = require('./routes/index');
var articleRouter = require('./routes/article');
var uploadImageRouter = require('./routes/upload');
var archivesRouter = require('./routes/archives');
var userRouter = require('./routes/user');
var teamRouter = require("./routes/team");
var commentRouter = require('./routes/comment');
var CONFIG = require('../config-server');

var app = express();

app.use(bodyParser.json({limit: CONFIG.jsonBodySizeLimit}));
app.use(bodyParser.urlencoded({limit: CONFIG.jsonBodySizeLimit, extended: true}));

// static file
// app.use(express.static(path.join(__dirname, 'public')));
app.use("/api/attachments/", express.static(path.join(__dirname, 'attachments')));

// 禁用304
app.disable("etag");

// 跨域设置
app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	res.header("X-Powered-By",' 3.2.1');
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
	var token = req.body.token || req.query.token || req.headers['token'];
	req.user = {};
	req.token = "";
	if (token && !(await jwt.isDelToken(token))) {
		// console.log(token);
		var user = await jwt.verifyToken(token);
		if (user && user.secret && user.secret == CONFIG.jwt.secretOrPrivateKey) {
			var newToken = await jwt.signToken(utils.getUser(user));
			res.setHeader("token", newToken);
			req.user = user;
			req.token = token;
		}
	}
	next();
});

// app.use(cookieParser('cookie')); //设置coookie签名用的字符串,这个字符串要和session里面相同。

// app.use(session({
//     cookie: ('name', 'value', {
// 		maxAge: 30 * 60 * 1000,
// 		secure: false,
// 		name: CONFIG.title,
// 		resave: true
// 	}),
//     resave: true, //每次设置是否要保存
//     saveUninitialized:true, //是否存储没有初始化的session. 所谓初始化是指生成session.id以后有没有设置value修改过此session
//     secret:'cookie',//签名字符串，需要和cookie的设置相同
//     rolling:true,//每次响应是否重新设置cookie的maxAge.
//     // unset:'destroy',//每次相应结束是否摧毁session
// }));

// app.use('/', indexRouter);

app.use('/api/user', userRouter);
app.use('/api/team', teamRouter);
app.use('/api/article', articleRouter);
app.use('/api/upload', uploadImageRouter);
app.use('/api/archives', archivesRouter);
app.use('/api/comment', commentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	res.type("html");
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {}	
	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
