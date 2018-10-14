/*jslint node: true*/

//parese cookie to object
var parseCookie = function(cookieString){
	var cookies = {};
	cookieString.split(";").forEach(function(val){
		val = val.trim().split("=");
		cookies[val[0]] = val[1];
	});
	return cookies;
};

var ioRoute = function (socket) {
	
	ioRoute.users = ioRoute.users || {};
	
	//new socket user
	var sessionCookies = parseCookie(socket.request.headers.cookie);
	console.log(sessionCookies);
	if(sessionCookies.userId) {
		console.log(sessionCookies.userId);
		ioRoute.users[sessionCookies.userId] = socket.id;
		console.log(ioRoute.users);
		socket.broadcast.emit('newUser', sessionCookies.userId);
	}
	
	//user disconnected
	socket.on("disconnect", function(){
		delete ioRoute.users[sessionCookies.userId];
		console.log("User leaves: %s", sessionCookies.userId);
		socket.broadcast.emit('userLeft', sessionCookies.userId);
	});
	
	//user challenge
	socket.on("challange", function(data){
		console.log(ioRoute.users[data.challenged]);
		socket.broadcast.to(ioRoute.users[data.challenged]).emit("challange", data.challenger);
	});
	
	//user refuse challenge
	socket.on("coward", function(data){
		console.log(data);
		socket.broadcast.to(ioRoute.users[data.challenger]).emit("coward", data.coward);
	});	
	
	//user accept challenge
	socket.on("fight", function(data){
		console.log(data);
		socket.broadcast.to(ioRoute.users[data.challenger]).emit("fight", data.challenged);
	});		
	
};

module.exports = ioRoute;

