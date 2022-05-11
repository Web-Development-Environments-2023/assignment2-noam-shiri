var left;
var up;
var right;
var down;
var food_requested;
var maxGameTime;
var monsters;
var color5points;
var color15points;
var color25points;
var points5radio;
var points15radio;
var points25radio;
var pacmanDirection='pacmanRight';
var monsterInfo; //for each monster: [direction, x, y, isOnBoard, lastCellInfo]
var colors = {"Yellow": "#FFFD98" , "Green": "#D0F3B8" , "Blue": "#B8D7F3" , "Pink": "#F3B8F1" , "Purple": "#D6B8F3"}
var addons; //for each addon: [name, x, y, isOnBoard, boardnumber]
var addonsCount;
var totalLoss;
var isLoss;
var starInfo;

function Start() {
	score = 0;
	totalLoss = 0;
	isLoss = false;
	monsterInfo = {'pink': ['pinkUp',1,1,true,0] , 'blue': ['blueUp',1,28,false,0], 'orange':['orangeUp',13,1,false,0] , 'red': ['redUp',13,28,false,0], 'marioStar':['marioStarUp',8,15,false,0]};
	addons = {0:["candy",0,0,false,11,0],1:["marioStar",8,15,false,13],2:["clock",0,0,false,10],3:["medicine",0,0,false,12]};
	addonsCount = 1;
	var ball5 = Math.floor(food_requested*0.6);
	var ball15 = Math.floor(food_requested*0.3);
	var ball25 = Math.floor(food_requested*0.1);
	ball5+=food_requested - (ball5+ball15+ball25)
	start_time = new Date();
	board=[[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
		[4,0,0,0,0,0,0,4,0,0,0,4,4,4,4,4,4,0,0,0,4,0,0,0,0,0,0,0,0,4],
		[4,0,4,4,0,4,0,4,0,4,0,0,0,4,0,0,0,0,4,0,0,0,4,4,4,0,4,4,0,4],
		[4,0,4,4,0,4,0,0,0,4,0,4,0,0,0,4,0,4,4,0,4,0,0,0,4,0,4,4,0,4],
		[4,0,0,0,0,4,0,4,0,0,0,4,0,4,4,4,0,0,4,0,0,0,4,0,4,0,0,0,0,4],
		[4,0,4,4,4,4,0,4,0,4,0,4,0,0,0,4,4,0,4,0,4,0,4,0,4,4,4,4,0,4],
		[4,0,0,0,0,4,0,4,0,4,0,0,0,4,0,0,0,0,0,0,4,0,4,0,4,0,0,0,0,4],
		[4,0,4,4,0,4,0,0,0,4,4,4,0,4,4,4,4,0,4,4,4,0,0,0,4,0,4,4,0,4],
		[4,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,4],
		[4,0,4,4,0,0,0,0,0,4,4,0,4,4,4,4,4,4,4,0,4,0,0,0,0,0,4,4,0,4],
		[4,0,0,0,0,4,4,4,4,4,0,0,0,4,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,4],
		[4,0,4,4,0,0,0,0,0,0,0,4,0,0,0,4,0,4,4,0,0,0,0,0,0,0,4,4,0,4],
		[4,0,4,4,0,4,0,4,4,4,4,4,4,0,4,4,0,4,4,4,4,4,4,0,4,0,4,4,0,4],
		[4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,4],
		[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]];
	var emptyCell;
	setCharactersOnBoard();
	while (ball5 > 0) {
		emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		ball5--;
	}	
	while (ball15 > 0) {
		emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 2;
		ball15--;
	}	
	while (ball25 > 0) {
		emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 3;
		ball25--;
	}
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 140); //140
	interval2 = setInterval(checkAddons, Math.floor(maxGameTime/10)*1000);
	interval3 = setInterval(candyOnOff, 5000); //every 5 seconds
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 14 + 1);
	var j = Math.floor(Math.random() * 29 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 14 + 1);
		j = Math.floor(Math.random() * 29 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[up]) {
		return 1;
	}
	if (keysDown[down]) {
		return 2;
	}
	if (keysDown[left]) {
		return 3;
	}
	if (keysDown[right]) {
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;

	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 30; j++) {
		  var center = new Object();
		  center.y = i * 30 + 15;
		  center.x = j * 30 + 15;
		  if (board[i][j] == 5) {
			var pacmanimg = new Image();
			pacmanimg.src = './pictures/'+pacmanDirection+'.png';
			context.drawImage(pacmanimg, center.x-15, center.y-15,30, 30);
			context.draw;
			} else if (board[i][j] == 1) {
			context.beginPath();
			context.arc(center.x, center.y, 5, 0, 2 * Math.PI); // circle
			context.fillStyle = colors[color5points]; //color food 5
			context.fill();
			} else if (board[i][j] == 2) {
			context.beginPath();
			context.arc(center.x, center.y, 5, 0, 2 * Math.PI); // circle
			context.fillStyle = colors[color15points]; //color food 15
			context.fill();
			} else if (board[i][j] == 3) {
			context.beginPath();
			context.arc(center.x, center.y, 5, 0, 2 * Math.PI); // circle
			context.fillStyle = colors[color25points]; //color food 25
			context.fill();
			} else if (board[i][j] == 4) {
			context.beginPath();
			context.rect(center.x - 15, center.y - 15, 30, 30);
			context.fillStyle = "#3E3247"; //color wall
			context.fill();
			}
			else if (board[i][j] == 6){
			var pinkMonster = new Image();
			pinkMonster.src = './pictures/'+monsterInfo['pink'][0]+'.png';
			context.drawImage(pinkMonster, center.x-15, center.y-15,30, 30);
			context.draw;
			}
			else if (board[i][j] == 7){
			var pinkMonster = new Image();
			pinkMonster.src = './pictures/'+monsterInfo['blue'][0]+'.png';
			context.drawImage(pinkMonster, center.x-15, center.y-15,30, 30);
			context.draw;
			}
			else if (board[i][j] == 8){
				var pinkMonster = new Image();
				pinkMonster.src = './pictures/'+monsterInfo['orange'][0]+'.png';
				context.drawImage(pinkMonster, center.x-15, center.y-15,30, 30);
				context.draw;
			}
			else if (board[i][j] == 9){
				var pinkMonster = new Image();
				pinkMonster.src = './pictures/'+monsterInfo['red'][0]+'.png';
				context.drawImage(pinkMonster, center.x-15, center.y-15,30, 30);
				context.draw;
			}
			else if (board[i][j] == 10){
				var clock = new Image();
				clock.src = './pictures/clock.png';
				context.drawImage(clock, center.x-15, center.y-15,30, 30);
				context.draw;
			}
			else if (board[i][j] == 11){
				var candy = new Image();
				candy.src = './pictures/candy'+addons[0][5]+'.png'; // different colors for candies
				context.drawImage(candy, center.x-15, center.y-15,30, 30);
				context.draw;
			}
			else if (board[i][j] == 12){
				var medicine = new Image();
				medicine.src = './pictures/medicine.png';
				context.drawImage(medicine, center.x-15, center.y-15,30, 30);
				context.draw;
			}
			else if (board[i][j] == 13){
				var star = new Image();
				star.src = './pictures/'+monsterInfo['marioStar'][0]+'.png';
				context.drawImage(star, center.x-15, center.y-15,30, 30);
				context.draw;
			}
			// else if (board[i][j] == 14){
			// 	var boom = new Image();
			// 	boom.src = './pictures/boom.png';
			// 	context.drawImage(boom, center.x-15, center.y-15,30, 30);
			// 	context.draw;
			// }
		}
	  }
	}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	var wasHereBefore = 0;
	if (x == 1) { //up
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
			pacmanDirection='pacmanUp'
		}
	}
	if (x == 2) { //down
		if (shape.i < 14 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
			pacmanDirection='pacmanDown'
		}
	}
	if (x == 3) { //left
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
			pacmanDirection='pacmanLeft'
		}
	}
	if (x == 4) { //right
		if (shape.j < 29 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
			pacmanDirection='pacmanRight'
		}
	}
	if (board[shape.i][shape.j] == 1) { 
		score+=5;
	}
	if (board[shape.i][shape.j] == 2) { 
		score+=15;
	}
	if (board[shape.i][shape.j] == 3) { 
		score+=25;
	}
	if (board[shape.i][shape.j] == 10) { // clock
		maxGameTime+=20;
	}
	if (board[shape.i][shape.j] == 11) { // candy
		score+=30;
	}
	if (board[shape.i][shape.j] == 12) { // medicine
		//score+=50; //plus heart
	}
	if (board[shape.i][shape.j] == 13) {  // star 
		score+=50;
	}
	wasHereBefore = board[shape.i][shape.j]
	if(wasHereBefore >= 6 && wasHereBefore <= 9){ //monster
		isLoss = true;
	}
	if (!isLoss){
		board[shape.i][shape.j] = 5;
		UpdateMonsterPosition();
	}
	checkLoss();
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	var score2win = Math.floor(food_requested*0.6*5)
	if (score >= 500) { //TODO : change to correct score
		window.clearInterval(interval);
		window.clearInterval(interval2);
		window.alert("Game completed");
		document.getElementById("gameOption").disabled = false;
	}
	if(maxGameTime <= time_elapsed || totalLoss>=5){
		window.clearInterval(interval);
		window.clearInterval(interval2);
		window.alert("You lost!");
		document.getElementById("gameOption").disabled = false;
	}
	else {
		Draw();
	}
}	

function checkAddons(){ //for each addon: [name, x, y, isOnBoard, boardnumber]
	if(addons[addonsCount][3]==false){
		addCharacter(addonsCount);
	}
	else{
		removeCharacter(addonsCount);
	}
	addonsCount++;
	if (addonsCount>=(Object.entries(addons).length))
		addonsCount=1;
}

function candyOnOff(){
	if(addons[0][3]==false){
		num = getRandomInt(1,6);
		addCharacter(0);
		addons[0][5]=num;
	}
	else{
		removeCharacter(0);
	}
}

function addCharacter(addonsCount){ //for each addon: [name, x, y, isOnBoard, boardnumber]
	addons[addonsCount][3]=true;
	if (addonsCount==1){
		monsterInfo['marioStar'][4] = board[addons[1][1]][addons[1][2]];
		board[addons[1][1]][addons[1][2]] = 13; //star number
		monsterInfo['marioStar'][3] = true;
	}
	else{
		emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = addons[addonsCount][4];
		addons[addonsCount][1]=emptyCell[0];
		addons[addonsCount][2]=emptyCell[1];
	}
}

function removeCharacter(addonsCount){ //for each addon: [name, x, y, isOnBoard, boardnumber]
	if (addonsCount!=1){
		addons[addonsCount][3]=false;
		board[addons[addonsCount][1]][addons[addonsCount][2]]=0;
	}
}
function setCharactersOnBoard(){
	//pacman
	if (!(typeof shape.i==='undefined')) //won't do the if in the first call
		board[shape.i][shape.j] = 0;
	var emptyCell = findRandomEmptyCell(board);
	shape.i = emptyCell[0];
	shape.j = emptyCell[1];
	board[emptyCell[0]][emptyCell[1]] = 5;
	//monsters
	board [monsterInfo['pink'][1]][monsterInfo['pink'][2]] = monsterInfo['pink'][4];
	monsterInfo['pink'][1] = 1;
	monsterInfo['pink'][2] = 1;
	monsterInfo['pink'][4] = board[1][1];
	board[1][1] = 6; //pink monster
	if (monsters >= 2){
		board [monsterInfo['blue'][1]][monsterInfo['blue'][2]] = monsterInfo['blue'][4];
		monsterInfo['blue'][1] = 1;
		monsterInfo['blue'][2] = board[0].length-2;
		monsterInfo['blue'][4] = board[1][board[0].length-2] ;
		board[1][board[0].length-2] = 7; //blue monster
		monsterInfo['blue'][3] = true;
	}
	if (monsters >= 3){
		board [monsterInfo['orange'][1]][monsterInfo['orange'][2]] = monsterInfo['orange'][4];
		monsterInfo['orange'][1] = board.length-2;
		monsterInfo['orange'][2] = 1;
		monsterInfo['orange'][4] = board[board.length-2][1];
		board[board.length-2][1] = 8; //orange monster
		monsterInfo['orange'][3] = true;
		}
	if (monsters == 4){
		board [monsterInfo['red'][1]][monsterInfo['red'][2]] = monsterInfo['red'][4];
		monsterInfo['red'][1] = board.length-2;
		monsterInfo['red'][2] = board[0].length-2;
		monsterInfo['red'][4] = board[board.length-2][board[0].length-2] ;
		board[board.length-2][board[0].length-2] = 9; //red monster
		monsterInfo['red'][3] = true;
		}
}

function UpdateMonsterPosition(){
	var currMonster = 6;
	for ([monsterColor, monsterDetails] of Object.entries(monsterInfo)) {
		var isStar = false;
		if (!monsterDetails[3]) //if monster is not on board
			continue;
		var i = monsterDetails[1];
		var j=monsterDetails[2];
		if (monsterColor=='marioStar'){
			isStar = true;
			x = getRandomInt(1,5);
		}
		else{
			x = getBestDirection(i,j); // TODO : change to smart x
		}
		if (x == 1) { //up
			if (i > 0 && board[i - 1][j] != 4 && (board[i - 1][j]<=5 || board[i - 1][j] >= 10)) {
				board[i][j] = monsterDetails[4];
				monsterInfo[monsterColor][4] = board[i-1][j];
				monsterInfo[monsterColor][1]--;
				monsterInfo[monsterColor][0]=monsterColor+'Up'
				//console.log(monsterColor, "11111111");
				}
			}
		if (x == 2) { //down
			if (i < 14 && board[i + 1][j] != 4 && (board[i + 1][j]<=5 || board[i + 1][j] >= 10)) {
				board[i][j] = monsterDetails[4];
				monsterInfo[monsterColor][4] = board[i+1][j];
				monsterInfo[monsterColor][1]++;
				monsterInfo[monsterColor][0]=monsterColor+'Down'
				//console.log(monsterColor, "222222222");
				}
				
			}
		if (x == 3) { //left
			if (j > 0 && board[i][j - 1] != 4 && (board[i][j - 1]<=5 || board[i][j - 1] >= 10)) {
				board[i][j] = monsterDetails[4];
				monsterInfo[monsterColor][4] = board[i][j-1];
				monsterInfo[monsterColor][2]--;
				monsterInfo[monsterColor][0]=monsterColor+'Left'
				//console.log(monsterColor, "3333333");
				}

			}
		if (x == 4) { //right
			if (j < 29 && board[i][j + 1] != 4 && (board[i][j + 1]<=5 || board[i][j + 1] >= 10)) {
				board[i][j] = monsterDetails[4];
				monsterInfo[monsterColor][4] = board[i][j+1];
				monsterInfo[monsterColor][2]++;
				monsterInfo[monsterColor][0]=monsterColor+'Right'
				//console.log(monsterColor , "444444444");
				}
			}
		if(board[monsterInfo[monsterColor][1]][monsterInfo[monsterColor][2]]==5 && !isStar){ //pacman met monster -> 1 loss
			monsterInfo[monsterColor][4] = 0;
			isLoss = true;
			//console.log(monsterColor, "KILL");
		}
		if(board[monsterInfo[monsterColor][1]][monsterInfo[monsterColor][2]]==5 && isStar){ //pacman met star -> 50 points
			board[i][j]=monsterInfo[monsterColor][4];
			monsterInfo[monsterColor][4]=0;
			monsterInfo[monsterColor][3] = false;
			score+=50;
			//console.log(monsterColor, "50 POINTS");
			//[direction, x, y, isOnBoard, lastCellInfo]
		} 
		else{
			if (isStar)
				board[monsterInfo[monsterColor][1]][monsterInfo[monsterColor][2]] = 13; //update monster location on board
			else
				board[monsterInfo[monsterColor][1]][monsterInfo[monsterColor][2]] = currMonster; //update monster location on board
			currMonster++; //next monster sirial number
			//console.log(monsterColor ,x  , "7777777777");
		}
	// TO DO:  check if collapsed and if so decrease points and restart
	}
}

function getBestDirection(x,y){
	number = getRandomInt(1,5);
	return number;
}

function checkLoss(){
	if(!isLoss)
		return;
	totalLoss++;
	score-=10;
	board[shape.i][shape.j] = 0;
	setCharactersOnBoard();
	isLoss = false;
}