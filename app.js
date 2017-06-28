var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var colors = require('colors');
require('dotenv').config();
var passport = require('passport');
require('./models/models');
var index = require('./routes/index');
var authenticate = require('./routes/authenticate')(passport);
var mongoose = require('mongoose');
var socket_io = require("socket.io");
//mongoose.connect('mongodb://localhost/test-chirp');
//var uri = "mongodb://admin:admin@ds139082.mlab.com:39082/chatter-db"
var uri = "mongodb://"+process.env.DB_URI;
mongoose.connect(uri, function (err) {
    if (err)  throw err
    console.log("Db Connected");
});

// Socket Connection Part. app.io will be required in bin/www
var app = express();
var io = socket_io();
app.io = io;

io.on('connection', function(client) {
    console.log('Client connected...'.green);
    /*client.on('disconnect', function () {
        console.log("Client disconnected".red);
    });*/
    client.on('chat message', function (msg) {
        console.log("message :"+msg)
        io.emit('chat message', msg);
    })
    });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(session({
    secret: 'keyboard cat'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
var initPassport = require('./passport-init');
initPassport(passport);
app.use('/', index);
app.use('/auth', authenticate);


app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;
