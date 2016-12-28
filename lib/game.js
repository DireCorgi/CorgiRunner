const Player = require('./player');
const Background = require('./background');
const Tree = require('./tree');
const Bird = require('./bird');
const Score = require('./score');
const Util = require('./util');
const drawGameOver = require('./game_over');
const Menu = require('./menu');
const Difficulty = require('./difficulty');

const HARD = {
 birds: true,
 multiplier: 7,
 maxTrees: 3,
 maxObstacles: 8,
};

const MEDIUM = {
  birds: false,
  multiplier: 3,
  maxTrees: 3,
  maxObstacles: 7,
};

const EASY ={
  birds: false,
  multiplier: 1,
  maxTrees: 1,
  maxObstacles: 6,
};

class Game {
  constructor(ctx, gameCanvas, backgroundCtx, foregroundCtx) {
    this.ctx = ctx;
    this.gameCanvas = gameCanvas;
    this.player = new Player({ position: [100 , 210] });
    this.obstacleInterval = 0;
    this.spawnRate = 60;
    this.nextSpawn = this.spawnRate + Util.getRandomIntInclusive(0, 25);
    this.obstacles = [];
    this.score = new Score(1);
    this.muteMusic = false;

    this.jump = this.jump.bind(this);
    this.draw = this.draw.bind(this);
    this.resetGame = this.resetGame.bind(this);

    this.highScoreInput = document.getElementsByClassName("high-score-form")[0];

    this.createBackground(backgroundCtx, foregroundCtx);
    this.setSounds();
    this.setButtonListeners();

    Menu.setMenuButtons(this);
  }

  jump(event) {
    if (event.code === 'Space' && this.gamePlaying && !this.gameOver) {
      event.preventDefault();
      if (!this.gameOver)
        this.player.toggleJump();
    }
  }

  openMenu() {
    this.score.setScore();
    if (!this.muteMusic) {
      this.menuMusic.volume = 0.7;
      this.menuMusic.play();
    }
  }

  toggleMute() {
    if (this.muteMusic) {
      this.muteMusic = false;
      if (this.gamePlaying) this.backgroundMusic.play();
      else this.menuMusic.play();
    } else {
      this.muteMusic = true;
      this.backgroundMusic.pause();
      this.menuMusic.pause();
    }
    return this.muteMusic;
  }

  setButtonListeners() {
    this.gameCanvas.addEventListener('keydown', this.jump);
    this.gameCanvas.addEventListener('keydown', this.resetGame);
  }

  setSounds() {
    this.bark = new Audio('./assets/sounds/bork.wav');
    this.gameOverSound = new Audio('./assets/sounds/sad.wav');
    this.backgroundMusic = new Audio('./assets/sounds/background-music.mp3');
    this.backgroundMusic.loop = true;
    this.menuMusic = new Audio('./assets/sounds/menu-music.mp3');
    this.menuMusic.loop = true;

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

  start(difficulty) {
    document.getElementById('game-canvas').focus();
    this.difficulty = difficulty;
    this.menuMusic.pause();
    this.menuMusic.currentTime = 0;
    if (!this.muteMusic) this.backgroundMusic.play();
    this.gamePlaying = true;
    this.gameOver = false;
    this.canReset = false;
    this.paused = false;
    const corgi = document.getElementsByClassName("corgi")[0];
    this.highScoreInput.className = 'high-score-form close';
    corgi.className = 'corgi';
    document.getElementById('game-over-menu').className = 'game-over';
    this.trees = 0;
    this.score.score = 0;
    this.player.position = [100, 210];
    this.obstacles = [];
    const diffOptions = Difficulty[difficulty];
    this.birds = diffOptions.birds;
    this.score.multiplier = diffOptions.multiplier;
    this.maxTrees = diffOptions.maxTrees;
    this.maxObstacles = diffOptions.maxObstacles;
    this.draw();
  }

  setScore(name) {
    const scoreIdx = this.score.checkHighScore();
    this.score.updateLocalHighScore(scoreIdx, name);
    this.score.setScore();
  }

  stopGame() {
    const corgi = document.getElementsByClassName("corgi")[0];
    const highScore = this.score.checkHighScore();
    if(highScore > -1) {
      this.highScoreInput.className='high-score-form';
    }
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
    if(e.key === 'r' && this.canReset && !this.paused) {
      e.preventDefault();
      this.start(this.difficulty);
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
