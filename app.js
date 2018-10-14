/*jslint node: true*/

var express = require('express'),
	login = require('./routes/login'),
	logger = require('morgan'),
	ajax = require('./routes/ajax'),
	ioRoute = require('./routes/ioRoute');

var app = express();
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

//strat http Server
var server = app.listen(server_port, function () {
	console.log('Ninja server started');
});

//initiate socket connection
var io = require('socket.io').listen(server);

//ignore favicon request
app.use('/favicon.ico', function(req, res){
	res.end();
});

//start logging requests
app.use(logger('dev'));

//process static files requests
app.use(express.static('./public'));

//ajax requests
app.use('/', ajax);

//validate if user logged in
app.use('/', login);

//manage socket communication
io.on('connection', ioRoute);

module.exports = app;