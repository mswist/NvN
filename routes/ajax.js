/*jslint node: true*/
var express = require('express'),
	ajax = express.Router(),
	ioRoute = require('./ioRoute');
	
ajax.get('/getUsers', function(req, res){
	console.log(Object.keys(ioRoute.users));
	res.jsonp({users: Object.keys(ioRoute.users)});
});

module.exports = ajax;
