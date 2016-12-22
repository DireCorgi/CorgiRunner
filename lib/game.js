const Player = require('./player.js');
const Background = require('./background.js');
const Tree = require('./tree');

class Game {
  constructor(ctx, gameCanvas, backgroundCtx, foregroundCtx) {
    this.ctx = ctx;
    this.gameCanvas = gameCanvas;
    this.player = new Player({ position: [100 , 210] });
    this.gameOver = false;
    this.maxObstacles = 5;
    this.obstacleInterval = 0;
    this.spawnRate = 150;
    this.obstacles = [];

    this.jump = this.jump.bind(this);
    this.draw = this.draw.bind(this);
    this.resetGame = this.resetGame.bind(this);

    this.createBackground(backgroundCtx, foregroundCtx);
    this.setButtonListeners();
  }

  jump(event) {
    if (event.code === 'Space') {
      event.preventDefault();
      this.player.toggleJump();
    }
  }


  setButtonListeners() {
    document.addEventListener('keydown', this.jump);
    document.addEventListener('keydown', this.resetGame);
  }

  createObstacles() {
    if (this.obstacleInterval === 0 && this.obstacles.length < this.maxObstacles) {
      this.obstacles.push(this.generateObstacle());
      this.obstacleInterval += 1;
    } else if(this.obstacleInterval === this.spawnRate) {
      this.obstacleInterval = 0;
    } else {
      this.obstacleInterval += 1;
    }
  }

  generateObstacle() {
    const obstacle = new Tree({ startPos: [820, 140], speed: 4 });
    return obstacle;
  }

  createBackground(backgroundCtx, foregroundCtx) {
    const backgroundImage = new Image();
    backgroundImage.src = './assets/images/scrolling-background.jpg';
    this.background = new Background(backgroundCtx, backgroundImage, -35, 1422, 0.8);

    const foregroundImage = new Image();
    foregroundImage.src = './assets/images/foreground-grass.png';
    this.foreground = new Background(foregroundCtx, foregroundImage, 250, 720, 4);
  }

  start() {
    this.draw();
  }

  stopGame() {
    this.gameOver = true;
    const corgi = document.getElementsByClassName("corgi")[0];
    corgi.className += ' run-away';
  }

  resetGame(e) {
    e.preventDefault();
    if(e.key === 'r' && this.gameOver) {
      this.gameOver = false;
      const corgi = document.getElementsByClassName("corgi")[0];
      corgi.className = 'corgi';
      this.player.position = [100, 210];
      this.obstacles = [];
      this.start();
    }
  }

  draw() {
    if (!this.gameOver) {
      requestAnimationFrame(this.draw);
      this.player.update(this.ctx);
      this.createObstacles();
      let deleteIdx = null;
      this.obstacles.forEach((obstacle, idx) => {
        obstacle.step(this.ctx);
        if (obstacle.outOfBounds()){
          deleteIdx = idx;
        }
        if (this.player.collidedWith(obstacle)) {
          this.stopGame();
        }
      });
      if(deleteIdx !== null){
        this.obstacles.splice(deleteIdx, 1);
      }
      this.background.draw();
      this.foreground.draw();
    }
  }

}

module.exports = Game;
