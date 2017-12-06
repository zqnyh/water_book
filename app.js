var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mywater', { useMongoClient: true });
mongoose.Promise = global.Promise;
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var dbUrl='mongodb://localhost/mywater'
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	resave: true,  // 新增
    saveUninitialized: true,  // 新增
	secret:'waterbook',
	Store:new MongoStore({
		url:dbUrl
	})
}));
require('./config/routes')(app)
// if('development'===app.get('env')){
// 	app.set('showStackError',true)
// 	app.use(logger(':method :url :status'))
// 	app.locals.pretty=true
// 	mongoose.set('debug',true)
// }
app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res,next)=>{
	console.log('\r\n------',new Date().toLocaleString(),'-------')
	console.log(req.method,req.url);
	next();
})


app.listen(3000)
