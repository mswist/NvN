/*jslint node: true*/

var express = require('express'),
	Datastore = require('nedb'),
	cookie = require('cookie-parser'),
	bodyParser = require('body-parser');	

var login = express.Router();
var db = new Datastore({ filename: '../db/data.db', autoload: true });

login.use(bodyParser.urlencoded({ extended: false }));
login.use(cookie());

//post request - expected username
//if username provided, create cookie
login.post('/', function(req, res, next) {
	if(req.body.name) {
		res.cookie("userId", req.body.name, {maxAge: 999999999});
	}
	next();
});

//every request - if cookie with username exist, load index.html, otherwise login.html
login.use(function (req, res) {
	if(req.cookies.userId || req.body.name) {
		console.log("Authorized user %s",req.cookies.userId || req.body.name);
		console.log(req.path);
		res.sendFile('html/index.html',{root: './public'});
	}
	else {
		console.log("New user");
		res.sendFile('html/login.html',{root: './public'});
	}
});

module.exports = login;