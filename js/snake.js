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
