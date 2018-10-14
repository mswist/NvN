/*jslint browser: true*/
/*global board*/

var Ninja = function(){
	
	var ninja = {},
		ninjasDivs = document.querySelectorAll(".ninja"),
		boardDiv = document.getElementById("gameBoard");
	
	//ninja divs array
	ninja.ninjas = [];
	
	//populate ninjas array
	[].forEach.call(ninjasDivs, function(ninjaDiv){
		var player = ninjaDiv.id.substr(1,1);
		var ninjaNum = ninjaDiv.id.substr(3,1);
		if(!ninja.ninjas[player]) {
			ninja.ninjas[player] = [];
		}
		ninja.ninjas[player][ninjaNum] = ninjaDiv;
	});
	
	//initialize ninjas (new game)
	ninja.init = function() {
		for(var i=0; i<6; i++) {
			if(i<3) {
				boardDiv.rows[i].cells[i].appendChild(ninja.ninjas[0][i]);
				boardDiv.rows[i].cells[14-i].appendChild(ninja.ninjas[1][i]);
			}
			else {
				boardDiv.rows[i].cells[5-i].appendChild(ninja.ninjas[0][i]);
				boardDiv.rows[i].cells[9+i].appendChild(ninja.ninjas[1][i]);				
			}
		}
		[].forEach.call(ninjasDivs, function(ninjaDiv){
			ninjaDiv.onmouseover = board.ninjaPaths;
		});
	};
		
	return ninja;
	
};