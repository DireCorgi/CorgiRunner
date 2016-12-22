const Player = require('./player.js');
const Background = require('./background.js');

class Game {
  constructor(ctx, gameCanvas, backgroundCtx) {
    this.ctx = ctx;
    this.gameCanvas = gameCanvas;
    this.background = new Background(backgroundCtx);
    this.player = new Player({position: [100 , 220]});
    this.jump = this.jump.bind(this);
    this.draw = this.draw.bind(this);
    this.setButtonListeners();
  }

  jump() {
    this.player.toggleJump();
  }

  setButtonListeners() {
    this.gameCanvas.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        this.jump();
      }
    });
  }

  start() {
    this.draw();
  }

  draw() {
    requestAnimationFrame(this.draw);
    this.player.update(this.ctx);
    this.background.draw();
  }
}

module.exports = Game;
