/*jslint browser: true*/
/*global io, board */	

var App = function(){
	
	var users = [];
	var usersUl = document.getElementById("available");
	var cookies = {};
	
	//get User Name from cookie
	(function setUserName(){
		document.cookie.split(",").every(function(val){cookies[val.split("=")[0]] = val.split("=")[1];});
		if(cookies.userId) {
			var userNameEl = document.getElementById("userName");
			userNameEl.textContent = cookies.userId;
			userNameEl.onclick = function(){
				document.cookie = "userId=;expires=Wed 01 Jan 1970";
				location.href = location.href;
			};
		}
	})();
	
	//challenge other user
	function challange(ev){
		var challengedUser = ev.target.firstChild.data;
		if(!ev.currentTarget.className) {
			ev.currentTarget.className = "challenge";
			ev.currentTarget.innerHTML = challengedUser + "<span> challenged!!!</span>";
			socket.emit("challange", {challenger: cookies.userId, challenged: challengedUser});
		}
		else {
			ev.currentTarget.className = "";
			ev.currentTarget.removeChild(ev.currentTarget.children[0]);
			socket.emit("coward", {challenger: challengedUser, coward: cookies.userId});
		}
	}
	
	//add single user to the list - on user connect
	function addUser(user) {
		if(user!=cookies.userId){
			users.push(user);
			var li = document.createElement('li');
			li.textContent = user;
			li.onclick = challange;
			usersUl.appendChild(li);
		}
	}
	
	//accept challange
	function fight(ev) {
		var challenger = ev.currentTarget.parentNode.firstChild.textContent;
		socket.emit("fight",{challenger: challenger ,challenged: cookies.userId});
		board.load(challenger, cookies.userId);	
	}
	
	//refuse challenge
	function coward(ev){
		ev.currentTarget.parentNode.className = "";
		ev.currentTarget.parentNode.onclick = challange;
		var challenger = ev.currentTarget.parentNode.firstChild.textContent;
		ev.currentTarget.parentNode.innerHTML = challenger;
		socket.emit("coward",{challenger: challenger, coward: cookies.userId});
		ev.preventDefault();
		ev.stopPropagation();
		return false;
	}

	//list all users - jsonp callback
	this.listUsers = function(json){
		json.users.forEach(addUser);
	};

	var socket = io.connect(location.href);

	//get list of users (jsonp using <script>)
	(function getUsersList(){
		var script = document.createElement('script');
		script.src = 'http://' + location.host + '/getUsers?callback=app.listUsers';
		document.head.appendChild(script);
	})();
	
	//new user joined
	socket.on('newUser', addUser);
	
	//other user left
	socket.on('userLeft', function(user){
		var index = users.indexOf(user);
		users.splice(index, 1);
		usersUl.removeChild(usersUl.children[index]);
	});
	
	//user is challenged
	socket.on("challange", function(challenger){
		var challengerLi = usersUl.children[users.indexOf(challenger)];
		challengerLi.className = "challenged";
		challengerLi.innerHTML = challenger + "<span> challenged You!</span><i class='action coward'></i><i class='action fight'></i>";
		challengerLi.onclick="";
		challengerLi.children[2].onclick = fight;
		challengerLi.children[1].onclick = coward;
	});
	
	//user rejects challenge
	socket.on("coward", function(coward){
		var cowardLi = usersUl.children[users.indexOf(coward)];
		cowardLi.className = "";
		cowardLi.innerHTML = coward;
		cowardLi.onclick = challange;
	});
	
	//opponent accepted challenge
	socket.on("fight", function(challenged){
		board.load(cookies.userId, challenged);
	});
	
	return this;
	
};