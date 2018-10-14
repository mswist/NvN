/*jslint browser: true*/
/*global ninja*/

var Board = function(){
	
	var board = {};
	board.roll = 0;
	board.rows = document.getElementsByTagName("tr");
	var _newDice;
	
	board.load = function(challanger, challenged) {
		var playersNameSpan = document.querySelectorAll("#board .header h1 span");
		playersNameSpan[0].innerHTML = challanger;
		playersNameSpan[1].innerHTML = challenged;
		document.getElementById("index").style.display = "none";
		document.getElementById("board").style.display = "";
		document.getElementById("dices").onclick = _rollDice;
		_newDice = document.getElementById("dices").cloneNode(true);
		ninja.init();
	};
	
	board.ninjaPaths = function(ev) {
		var targetTiles = document.querySelectorAll('.target');
		[].forEach.call(targetTiles, function(tile){
			tile.innerHTML = "";
			tile.classList.remove("target");
		});
		var allPaths = [],
			vectors = [[-1, 0, 1], [-1, 0, -1], [0, 1, -1], [0, 1, 1], [1, 0, 1], [1, 0, -1], [0, -1, -1], [0, -1, 1]],
			ninja = ev.target;
	
		for (var i = 0; i < 8; i += 1) {
			allPaths.push(_getSinglePath(vectors[i], [ninja.parentElement.parentElement.rowIndex, ninja.parentElement.cellIndex], board.roll));
		}

		allPaths.forEach(function (paths) {
			paths.forEach(function (path) {
				var cells = board.rows[path[0]].getElementsByTagName("td");
				cells[path[1]].classList.add("target");
				cells[path[1]].innerHTML = "<a href='/move/" + path[0] + "/" + path[1] + "'></a>";
			});
		});

	};
	
	var _getSinglePath = function (vector, initPos, roll) {
		var initRow = initPos[0],
			initCol = initPos[1],
			path = [],
			i,
			x,
			y;

		for (i = roll; i >= 1; i -= 1) {
			y = vector[0] * i + (vector[1] !== 0 ? (vector[2] * (roll - i)) : 0);
			x = vector[1] * i + (vector[0] !== 0 ? (vector[2] * (roll - i)) : 0);

			if ((initRow + y) < 0 || (initCol + x) < 0 || (initRow + y) > 5 || (initCol + x) > 14) { continue; }

			var tiles = [];
			if (y<0) { for(var yi = -1; yi >= y; yi -= 1) { tiles.push([initRow + yi, vector[0] ? initCol : initCol + x]); } }
			if (y>0) { for(var yi = 1; yi <= y; yi += 1)  { tiles.push([initRow + yi, vector[0] ? initCol : initCol + x]); } }
			if (x<0) { for(var xi = -1; xi >= x; xi -= 1) { tiles.push([vector[0] ? initRow + y : initRow, initCol + xi]); } }
			if (x>0) { for(var xi = 1; xi <= x; xi += 1)  { tiles.push([vector[0] ? initRow + y : initRow, initCol + xi]); } }

			if (_collision(tiles, [initRow + y, initCol + x])) { break; }

			path.push([initRow + y, initCol + x, tiles]);
		}

		return path;
	};

	var _collision = function (tiles, destination) {
		
		var collide = false;
		
		tiles.forEach(function(pos){
			if(board.rows[pos[0]].cells[pos[1]].hasChildNodes()) { 
				collide = true;
				return;
			}
		});
		
		return collide;

	};
	
	var _rollDice = function() {
		var dice1 = Math.floor((Math.random() * 4) + 1);
		var dice2 = Math.floor((Math.random() * 4) + 1);
		board.roll = dice1 + dice2;
		document.getElementById("dice1").style.transform = "rotateY(" + ((dice1 + 7) * (-90)) + "deg)";
		document.getElementById("dice2").style.transform = "rotateY(" + ((dice2 + 7) * (-90)) + "deg)";
	};
	
	return board;
	
};