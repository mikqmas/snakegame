const Board = require('./snake.js');
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
