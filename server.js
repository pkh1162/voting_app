'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require("mongoose");
var passport = require("passport");
var session = require("express-session");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");


var app = express();

app.use(cookieParser());

require("dotenv").config();
require("./app/config/passport")(passport);

mongoose.Promise = global.Promise;          // Get a deprecated warning for mongoose's promise library. Need this line to fix it.

mongoose.connect(process.env.MONGO_URI); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use("/common", express.static(process.cwd() + "/app/common"));



app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


routes(app, passport);

app.listen(process.env.PORT, function () {
        console.log("Im listening");
    
});


