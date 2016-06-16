/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	const View = __webpack_require__(1);
	
	
	$( () => {
	  new View();
	
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Board = __webpack_require__(2);
	View.KEYMATCH = {
	  37: "W",
	  38: "N",
	  39: "E",
	  40: "S"
	};
	
	function View(){
	  // this.$el = $el;
	  this.board = new Board();
	  // debugger
	  this.setupBoard();
	
	  $('body').on("keydown", (event) => {
	    let keyPress = View.KEYMATCH[event.which];
	    this.board.snake.turn(keyPress);
	  });
	
	  setInterval(this.step.bind(this), 500);
	}
	
	View.prototype.setupBoard = function (){
	  let $game = $("<game></game>");
	  for(let i = 0; i < 20; i++){
	    let $ul = $(`<ul id=${i}></ul>`);
	
	    for(let j = 0; j < 20; j++){
	      let $li = $(`<li id=${j}></li>`);
	      $ul.append($li);
	    }
	
	    $game.append($ul);
	  }
	  $("body").append($game);
	};
	
	
	View.prototype.step = function () {
	  this.board.move();
	  $(`li`).removeClass("snake");
	  this.render();
	};
	
	View.prototype.render = function () {
	  this.board.grid.forEach((row, rowIndex) => {
	    let ul = $(`game`).children().get(rowIndex);
	    row.forEach((el, colIndex) => {
	      let li = $(ul).children().get(colIndex);
	      if (el === 1){
	        $(li).addClass("snake");
	      } else if (el === 2){
	        $('li').removeClass("apple");
	        $(li).addClass("apple");
	      }
	    });
	  });
	};
	
	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports) {

	Snake.DIRECTIONS = ["N","W","S","E"];
	Snake.FORBIDTURN = {
	  "N" : "S",
	  "S" : "N",
	  "E" : "W",
	  "W" : "E"
	};
	
	function Coord(x, y){
	  this.x = x;
	  this.y = y;
	}
	
	Coord.prototype.plus = function (direction){
	  let that = new Coord(this.x, this.y);
	  switch (direction){
	    case "N":
	      that.x -= 1;
	      break;
	    case "W":
	      that.y -= 1;
	      break;
	    case "E":
	      that.y += 1;
	      break;
	    case "S":
	      that.x += 1;
	  }
	  return that;
	};
	
	Coord.prototype.equals = function(otherCoord){
	  return (this.x === otherCoord.x) && (this.y === otherCoord.y);
	};
	
	Coord.prototype.isOpposite = function(){};
	
	// Snake
	
	function Snake (x, y){
	  this.direction = "N";
	  this.segments = [new Coord(x, y)];
	
	}
	
	Snake.prototype.move = function(){
	  // debugger
	  let newCoord = this.segments[0].plus(this.direction);
	  this.segments.unshift(newCoord);
	  return this.segments.pop();
	};
	
	Snake.prototype.grow = function () {
	  let newCoord = this.segments[0].plus(this.direction);
	  this.segments.unshift(newCoord);
	};
	
	Snake.prototype.turn = function (newDirection) {
	  if (Snake.FORBIDTURN[this.direction] !== newDirection) {
	    this.direction = newDirection;
	  }
	};
	
	// Board
	
	function Board() {
	  this.grid = [];
	  for(let i = 0; i < 20; i++){
	    this.grid.push(new Array (20));
	  }
	  // 1: snake
	  this.snake = new Snake(9, 9);
	  this.appleCreation();
	}
	
	Board.prototype.move = function () {
	
	  if ( this.apple.collision(this.snake.segments[0]) ) {
	    this.snake.grow();
	    this.grid[this.apple.x][this.apple.y] = 1;
	    // debugger;
	    // $(`ul#${this.apple.x} li#${this.apple.y}`).css("background-color", "green");
	    this.appleCreation();
	  } else {
	    let newEmptyCoord = this.snake.move();
	
	    this.grid[newEmptyCoord.x][newEmptyCoord.y] = undefined;
	  }
	
	  let newSnakeCoord = this.snake.segments[0];
	
	  if(newSnakeCoord.x > 19 || newSnakeCoord.y > 19 ||
	      newSnakeCoord.x < 0 || newSnakeCoord.y < 0) {
	    alert("Game Over");
	  }
	
	  this.snake.segments.slice(1).forEach((coord) => {
	    if(coord.collision(newSnakeCoord)){
	      alert("Game Over");
	    }
	  });
	
	  this.grid[newSnakeCoord.x][newSnakeCoord.y] = 1;
	
	};
	
	
	Board.prototype.appleCreation = function() {
	  let xApple = Math.floor(Math.random() * 19);
	  let yApple = Math.floor(Math.random() * 19);
	  this.apple = new Coord(xApple, yApple);
	  this.grid[xApple][yApple] = 2;
	};
	
	Coord.prototype.collision = function (otherCoord) {
	  return otherCoord.x === this.x && otherCoord.y === this.y;
	};
	
	module.exports = Board;
	
	// for testing
	window.Snake = Snake;
	window.Board = Board;
	window.Coord = Coord;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map