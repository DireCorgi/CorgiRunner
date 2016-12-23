const Player = require('./player');
const Background = require('./background');
const Tree = require('./tree');
const Bird = require('./bird');
const Score = require('./score');
const Util = require('./util');
const drawGameOver = require('./game_over');
const Menu = require('./menu');

class Game {
  constructor(ctx, gameCanvas, backgroundCtx, foregroundCtx) {
    this.ctx = ctx;
    this.gameCanvas = gameCanvas;
    this.player = new Player({ position: [100 , 210] });
    this.obstacleInterval = 0;
    this.spawnRate = 60;
    this.nextSpawn = this.spawnRate + Util.getRandomIntInclusive(0, 25);
    this.obstacles = [];

    this.jump = this.jump.bind(this);
    this.draw = this.draw.bind(this);
    this.resetGame = this.resetGame.bind(this);

    this.createBackground(backgroundCtx, foregroundCtx);
    this.setSounds();
    this.setButtonListeners();

    Menu.setMenuButtons(this);
  }

  jump(event) {
    if (event.code === 'Space' && !this.gameOver) {
      event.preventDefault();
      this.player.toggleJump();
    }
  }

  setButtonListeners() {
    document.addEventListener('keydown', this.jump);
    document.addEventListener('keydown', this.resetGame);
  }

  setSounds() {
    this.bark = new Audio('./assets/sounds/bork.wav');
    this.gameOverSound = new Audio('./assets/sounds/sad.wav');
    this.backgroundMusic = new Audio('./assets/sounds/background-music.mp3');
    this.backgroundMusic.loop = true;
  }

  pause() {
    this.paused = true;
  }

  unpause() {
    this.paused =false;
    if (this.gamePlaying) {
      this.draw();
    }
  }

  createObstacles() {
    if (this.obstacleInterval === 0 && this.obstacles.length < this.maxObstacles) {
      if (Math.random() < 0.8 && this.trees < this.maxTrees - 1) {
        this.nextSpawn = 8;
        this.trees += 1;
        this.obstacles.push(this.generateObstacle(true));
      } else {
        this.trees = 0;
        this.obstacles.push(this.generateObstacle());
      }
      this.obstacleInterval += 1;
    } else if(this.obstacleInterval === this.nextSpawn) {
      this.obstacleInterval = 0;
      this.nextSpawn = this.spawnRate + Util.getRandomIntInclusive(0, 25);
    } else {
      this.obstacleInterval += 1;
    }
  }

  generateObstacle(tree = false) {
    let obstacle = null;
    if (!this.birds || tree || Math.random() < 0.5) {
      let sprite = 'light';
      if (Math.random() > 0.5) {
        sprite = 'dark';
      }
      obstacle = new Tree({ startPos: [820, 140], speed: 6, sprite: sprite });
    } else {
      obstacle = new Bird({ startPos: [820, 49], speed: 7.8 });
    }
    return obstacle;
  }

  createBackground(backgroundCtx, foregroundCtx) {
    const backgroundImage = new Image();
    backgroundImage.src = './assets/images/scrolling-background.jpg';
    this.background = new Background(backgroundCtx, backgroundImage, -35, 1422, 0.8);

    const foregroundImage = new Image();
    foregroundImage.src = './assets/images/foreground-grass.png';
    this.foreground = new Background(foregroundCtx, foregroundImage, 250, 720, 6);
  }

  start(difficulty = 'hard') {
    this.difficuly = difficulty;
    this.backgroundMusic.play();
    this.gamePlaying = true;
    this.gameOver = false;
    this.canReset = false;
    this.paused = false;
    this.birds = true;
    const corgi = document.getElementsByClassName("corgi")[0];
    corgi.className = 'corgi'
    this.score = new Score(1);
    this.trees = 0;
    this.maxTrees = 3;
    this.player.position = [100, 210];
    this.maxObstacles = 8;
    this.obstacles = [];
    this.draw();
  }

  stopGame() {
    const corgi = document.getElementsByClassName("corgi")[0];

    this.backgroundMusic.pause();
    this.gameOverSound.volume = 0.9;
    this.gameOverSound.play();
    setTimeout(() => {
      corgi.className += ' run-away';
      this.bark.volume = 0.9;
      this.bark.play();
      drawGameOver(this.ctx);
    }, 700);
    setTimeout(() => {
      this.bark.volume = 0.6;
      this.bark.play();
      this.canReset = true;
    }, 1400);
    this.gameOver = true;
  }

  resetGame(e) {
    e.preventDefault();
    if(e.key === 'r' && this.canReset && !this.paused) {
      this.start(this.diffculty);
    }
  }

  draw() {
    if (!this.gameOver && !this.paused) {
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
      this.score.draw(this.ctx);
      this.background.draw();
      this.foreground.draw();
    }
  }

}

module.exports = Game;
