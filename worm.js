function degToRad(deg) {
	return deg * (Math.PI / 180);
}

function hasCollided(object1X, object1Y, object1Size, object2X, object2Y, object2Size) {
	var xDistance = object1X - object2X;
	var yDistance = object1Y - object2Y;
	var distance = Math.sqrt((xDistance * xDistance) + (yDistance * yDistance));
	
	if(distance < (object1Size + object2Size) - 2) {
		return true;
	}
	else {
		return false;
	}
}

var KeyDirection = {
	'left'	:37,
	'up'	:38,
	'right'	:39,
	'down'	:40
};

var Headings = {
	'west'	:180,
	'north'	:90,
	'east'	:0,
	'south'	:270
}

function Worm() {
	var turn;
	var movementTick;
	var color = "rgb(10,100,0)";
	var turnInterval = 10;
	var size = 5;
	var moveDistance = 1.75;
	var direction = 0;
	var length = 10;
	var bodyUnits = [];
	var inputKeyPressed = {
		'right': false,
		'up': false,
		'left': false,
		'down': false
	};
	var position = {
		'x' : 100,
		'y' : 100
	};
	
	function changeHeading(keyCode) {
		switch(keyCode) {
			case KeyDirection.left:
				_headWest(); 
				_moveWest();
			break;
			
			case KeyDirection.up:
				_headNorth();
				_moveNorth(); 
			break;
			
			case KeyDirection.right:
				_headEast();
				_moveEast(); 
			break;
			
			case KeyDirection.down:
				_headSouth();
				_moveSouth(); 
			break;
		}
	}
	
	function grow() {
		length += 8;
	}
	
	function stopHeadingChange(keyCode) {
		switch(keyCode) {
			case KeyDirection.left:
				clearInterval(turn);
			break;
			
			case KeyDirection.up:
				clearInterval(turn);
			break;
			
			case KeyDirection.right:
				clearInterval(turn);
			break;
			
			case KeyDirection.down:
				clearInterval(turn);
			break;
		}
	}
	
	function _moveNorth() {
		clearInterval(turn);
		turn = setInterval(_headNorth, window.SPEED / 2);
	}
	
	function _moveEast() {
		clearInterval(turn);
		turn = setInterval(_headEast, window.SPEED / 2);
	}
	
	function _moveSouth() {
		clearInterval(turn);
		turn = setInterval(_headSouth, window.SPEED / 2);
	}
	
	function _moveWest() {
		clearInterval(turn);
		turn = setInterval(_headWest, window.SPEED / 2);
	}
	
	function freezeHeading() {
		clearInterval(turn);
	}
	
	function hasEatenSelf() {
		for(var i = 0; i < length - 12; i++) {
			if(hasCollided(position.x, position.y, size, bodyUnits[i]['x'], bodyUnits[i]['y'], size)) {
				return true;
			}
		}
		return false;
	}
	
	function move() {
		bodyUnits.push({'x':position['x'], 'y': position['y']});
		position['x'] += Math.round(moveDistance * Math.cos(degToRad(direction)) * moveDistance);
		position['y'] -= Math.round(moveDistance * Math.sin(degToRad(direction)) * moveDistance);
		_draw();
		if(length <= bodyUnits.length){
			bodyUnits.shift();
		}
	}
	
	function pauseMovement() {
		clearInterval(movementTick);
	}
	
	function touchesArea(foodPos, foodSize) {
		for(var i = 0; i < bodyUnits.length; i++) {
			if(hasCollided(foodPos['x'], foodPos['y'], foodSize, bodyUnits[i]['x'], bodyUnits[i]['y'], size)) {
				return true;
			}
		}
		
		return false;
	}
	
	function _draw() {
		//move head
		CTX.beginPath();
		CTX.fillStyle = color;
		CTX.arc(bodyUnits[bodyUnits.length - 1]['x'], bodyUnits[bodyUnits.length - 1]['y'], size, 0, Math.PI * 2, false);
		CTX.closePath();
		CTX.fill();
		
		//move tail
		if(length <= bodyUnits.length) {
			//CTX.clearRect(bodyUnits[0]['x'] - size, bodyUnits[0]['y'] - size, bodyUnits[0]['x'] + size, bodyUnits[0]['y'] + size);
			
			CTX.beginPath();
			CTX.fillStyle = BACKGROUNDCOLOR;
			CTX.arc(bodyUnits[0]['x'], bodyUnits[0]['y'], 1+size, 0, Math.PI * 2, false);
			CTX.closePath();
			CTX.fill();
			
			CTX.beginPath();
			CTX.fillStyle = color;
			CTX.arc(bodyUnits[1]['x'], bodyUnits[1]['y'], size, 0, Math.PI * 2, false);
			CTX.closePath();
			CTX.fill();
		}
	}
	
	function _rotationCapCheck() {
		if(direction > 360) {
			direction -= 360;
		}
		else if(direction < 0) {
			direction += 360;
		}
	}
	
	function _headWest() {
		if(direction != Headings.west) {
			if(direction < Headings.west) {
				direction += turnInterval;
			}
			else {
				direction -= turnInterval;
			}
		}
		
		_rotationCapCheck();
	}
	
	function _headNorth() {
		if(direction != Headings.north) {
			if(direction < Headings.south
			&& direction > Headings.north) {
				direction -= turnInterval;
			}
			else {
				direction += turnInterval;
			}
		}
		
		_rotationCapCheck();
	}
	
	function _headEast() {
		if(direction != Headings.east) {
			if(direction > Headings.west) {
				direction += turnInterval;
			}
			else {
				direction -= turnInterval;
			}
		}
		
		_rotationCapCheck();
	}
	
	function _headSouth() {
		if(direction != Headings.south) {
			if(direction  < Headings.south
			&& direction > Headings.north) {
				direction += turnInterval;
			}
			else {
				direction -= turnInterval;
			}
		}
		
		_rotationCapCheck();
	}
	
	return {
		changeHeading:changeHeading,
		grow:grow,
		hasEatenSelf:hasEatenSelf,
		move:move,
		position:position,
		size:size,
		stopHeadingChange:stopHeadingChange,
		touchesArea:touchesArea
	};
}

function Food(_x, _y, size) {
	var color = "rgb(200,0,0)";
	var position = {
			'x' : _x,
			'y' : _y
		};
	
	function draw() {
		CTX.beginPath();
		CTX.fillStyle = color;
		CTX.arc(position['x'], position['y'], size, 0, Math.PI * 2, false);
		CTX.closePath();
		CTX.fill();
		//CTX.fillRect(position.x, position.y, gridSize, gridSize);
	}
	
	function eat() {
		//CTX.clearRect(position['x'] - size, position['y'] - size, position['x'] + size, position['y'] + size);
		
		CTX.beginPath();
		CTX.fillStyle = window.BACKGROUNDCOLOR;
		CTX.arc(position['x'], position['y'], size + 1, 0, Math.PI * 2, false);
		CTX.closePath();
		CTX.fill();
	}
		
	return {
		draw : draw,
		eat : eat,
		position : position,
		size : size
	}
}

function Game() {
	var score; 
	var level;
	var message;
	var player;
	var food;
	var paused;
	var tick;
	
	BACKGROUNDCOLOR = '#010101';
	$('body').css('background', BACKGROUNDCOLOR);
	canvas = $('canvas')[0];
	CTX = canvas.getContext('2d');
	WIDTH = canvas.width;
	HEIGHT = canvas.height;
	
	$('#newGame').click(newGame);
	
	function start() {
		paused = false;
		player = Worm();
		food = Food(200, 200,7);
		level = 1;
		score = 0;
		SPEED = 100;
		SPEEDINTERVAL = 20;
		
		food.draw();
		updateDomScore();
		updateDomLevel();
		
		$(document).keydown(function(event) {
			if(event.keyCode == 32 || event.keyCode == 80) {
				togglePause();
			}
			else if(!paused && event.keyCode >= 37 && event.keyCode <= 40) {
				player.changeHeading(event.keyCode);
			}
		});
		
		$(document).keyup(function(event) {
			if(event.keyCode >= 37 && event.keyCode <= 40) {
				player.stopHeadingChange(event.keyCode);
			}
		});
		
		if(tick){
			clearInterval(tick);
		}
		
		tick = setInterval(play,window.SPEED);
	}
	
	function hasEatenFood() {
		return hasCollided(food.position.x, food.position.y, food.size, player.position.x, player.position.y, player.size);
	}
	
	function newGame(){
		window.CTX.clearRect(0, 0, window.canvas.width, window.canvas.height);
		$('#message').text('');
		start();
	}
	
	function play() {
		player.move();
		
		if(wallHit() || player.hasEatenSelf()) {
			endGame();
		}
		
		if(hasEatenFood()) {
			food.eat();
			
			increaseScore();
			
			if(score % 50 == 0){
				increaseLevel();
			}
			
			player.grow();
			
			food = generateFood();
			
			while(player.touchesArea(food.position, food.size)) {
				food = generateFood();
			}
			
			food.draw();
		}
	}
	
	function generateFood() {
		var posX = (Math.random() * (window.WIDTH - (2 * player.size))) + player.size;
		var posY = (Math.random() * (window.HEIGHT - (2 * player.size))) + player.size;
		var size = (Math.random() * (5)) + 3;
		
		return Food(posX, posY, size);
	}
	
	function increaseLevel() {
		level++;
		clearInterval(tick);
		window.SPEED = window.SPEED - (window.SPEEDINTERVAL);
		tick = setInterval(play,window.SPEED);
		window.SPEEDINTERVAL -= 2;
		updateDomLevel();
	}

	function increaseScore() {
		score += 10;
		updateDomScore();
	}
	
	function togglePause() {
		if(paused) {
			paused = false;
			tick = setInterval(play,window.SPEED);
		}
		else {
			paused = true;
			clearInterval(tick);
		}
	}
	
	function endGame () {
		$(document).unbind('keydown');
		$('#message').text('Game Over, Sucka!');
		clearInterval(tick);
	}
	
	function updateDomScore() {
		$('#score .value').text(score);
	}
	
	function updateDomLevel() {
		$('#level .value').text(level);
	}
	
	function wallHit() {
		if((player.position['x'] - player.size < 0)
		||(player.position['y'] - player.size < 0)
		||(player.position['x'] + player.size > window.WIDTH)
		||(player.position['y'] + player.size > window.HEIGHT)) {
			return true;
		}
		else{
			return false;
		}
	}
	
	return {
		start: start,
		player:player
	};
}
