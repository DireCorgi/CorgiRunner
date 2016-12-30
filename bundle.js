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

	const Player = __webpack_require__(1);
	const Game = __webpack_require__(2);
	
	document.addEventListener('DOMContentLoaded', ()=> {
	  const gameCanvas = document.getElementById('game-canvas');
	  const canvasContext = gameCanvas.getContext('2d');
	
	  const backgroundCanvas = document.getElementById('background-canvas');
	  const backgroundCanvasContext = backgroundCanvas.getContext('2d');
	
	  const foregroundCanvas = document.getElementById('foreground-canvas');
	  const foregroundCanvasContext = foregroundCanvas.getContext('2d');
	
	  const game = new Game(
	    canvasContext,
	    gameCanvas,
	    backgroundCanvasContext,
	    foregroundCanvasContext
	  );
	
	  game.openMenu();
	
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	const SPRITES = {
	  walk1: [15, 11, 48, 64],
	  walk2: [187, 9, 34, 66],
	  walk3: [227, 11, 56, 64],
	  jump: [133, 11, 48, 64],
	  gameOver: [345, 77, 34, 76],
	};
	
	const PLAYER_HITBOX_OFFSET = {
	  posX: 3,
	  posY: 9,
	  sizeX: 27,
	  sizeY: 50,
	};
	
	class Player {
	
	  constructor(options) {
	    this.position = options.position;
	    this.walkspeed = options.walkspeed ? options.walkspeed : 1;
	    this.falling = false;
	    this.jumping = false;
	    this.jumpCount = 0;
	    this.spriteSheet = new Image();
	    this.spriteSheet.src = './assets/images/player-sprites.png';
	    this.walkCycle = 0;
	    this.gameOver = false;
	    this.jumpSound = new Audio('./assets/sounds/jump.wav');
	    this.jumpSound.volume = 0.3;
	  }
	
	  jump() {
	    const gravity = 0.40;
	    const initialSpeed = 12;
	    if (this.jumping) {
	      if (this.jumpCount === 0 || !this.onGround()){
	        this.position[1] -= initialSpeed - gravity * this.jumpCount;
	        this.jumpCount += 1;
	      } else {
	        this.position[1] = 210;
	        this.jumpCount = 0;
	        this.jumping = false;
	      }
	    }
	  }
	
	  onGround() {
	    return this.position[0] === 100 && this.position[1] >= 210;
	  }
	
	  toggleJump() {
	    this.jumping = true;
	    if (this.onGround())
	      this.jumpSound.play();
	  }
	
	  getSprite() {
	    if (this.gameOver) {
	      return SPRITES.gameOver;
	    } else if (!this.onGround()) {
	      return SPRITES.jump;
	    } else if (this.walkCycle < 10) {
	      this.walkCycle += 1;
	      return SPRITES.walk1;
	    } else if (this.walkCycle < 20) {
	      this.walkCycle += 1;
	      return SPRITES.walk2;
	    } else if (this.walkCycle < 30) {
	      this.walkCycle +=1;
	      return SPRITES.walk3;
	    } else if (this.walkCycle < 39) {
	      this.walkCycle +=1;
	      return SPRITES.walk2;
	    } else {
	      this.walkCycle = 0;
	      return SPRITES.walk2;
	    }
	  }
	
	  draw(ctx) {
	    ctx.clearRect(0, 0, 800, 300);
	    const sprite = this.getSprite();
	    ctx.drawImage(
	      this.spriteSheet,
	      sprite[0],
	      sprite[1],
	      sprite[2],
	      sprite[3],
	      this.position[0],
	      this.position[1],
	      sprite[2],
	      sprite[3]
	    );
	    // ctx.beginPath();
	    // ctx.rect(this.position[0] + 3, this.position[1] + 9, 27, 50);
	    // ctx.lineWidth = 1;
	    // ctx.strokeStyle = 'yellow';
	    // ctx.stroke();
	  }
	
	  update(ctx) {
	    this.jump();
	    this.draw(ctx);
	  }
	
	  collidedWith(obstacle) {
	    const playerHitbox = this.hitbox();
	    const obstacleHitbox = obstacle.hitbox();
	    return !(
	      playerHitbox.maxX < obstacleHitbox.minX ||
	      playerHitbox.minX > obstacleHitbox.maxX ||
	      playerHitbox.maxY < obstacleHitbox.minY ||
	      playerHitbox.minY > obstacleHitbox.maxY
	    );
	  }
	
	  hitbox() {
	    return {
	      minX: this.position[0] + PLAYER_HITBOX_OFFSET.posX,
	      maxX: this.position[0] + PLAYER_HITBOX_OFFSET.posX + PLAYER_HITBOX_OFFSET.sizeX,
	      minY: this.position[1] + PLAYER_HITBOX_OFFSET.posY,
	      maxY: this.position[1] + PLAYER_HITBOX_OFFSET.posY + PLAYER_HITBOX_OFFSET.sizeY,
	    };
	  }
	
	}
	
	module.exports = Player;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Player = __webpack_require__(1);
	const Background = __webpack_require__(3);
	const Tree = __webpack_require__(4);
	const Bird = __webpack_require__(6);
	const Score = __webpack_require__(7);
	const Util = __webpack_require__(8);
	const drawGameOver = __webpack_require__(9);
	const Menu = __webpack_require__(10);
	const Difficulty = __webpack_require__(11);
	
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
	    if (event.code === 'Space' && this.gamePlaying) {
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	class Background {
	  constructor(ctx, image, posY, imageLength, speed) {
	    this.image = image;
	    this.speed = speed;
	    this.x = 0;
	    this.y = posY;
	    this.imageLength = imageLength;
	    this.ctx = ctx;
	  }
	
	  draw() {
	    this.ctx.clearRect(0, 0, 800, 300);
	    this.ctx.drawImage(this.image, this.x, this.y);
	    this.ctx.drawImage(this.image, this.x + this.imageLength, this.y);
	    if (this.imageLength < 800){
	      this.ctx.drawImage(this.image, this.x + this.imageLength * 2, this.y);
	    }
	    if (this.x <= -this.imageLength) {
	      this.x = 0;
	    }
	    this.scrollImage();
	  }
	
	  scrollImage() {
	    this.x -= this.speed;
	  }
	
	}
	
	module.exports = Background;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Obstacle = __webpack_require__(5);
	
	const TREE_SPRITES = {
	  lightTree: [12, 24, 146, 186],
	  darkTree: [176, 24, 146, 186],
	};
	
	const TREE_HITBOX_OFFSET = {
	  posX: 24,
	  posY: 20,
	  sizeX: 62,
	  sizeY: 120,
	};
	
	class Tree extends Obstacle {
	  constructor(options) {
	    options.hitboxOffset = TREE_HITBOX_OFFSET;
	    super(options);
	    this.sprite = options.sprite;
	    this.spriteSheet = new Image();
	    this.spriteSheet.src = './assets/images/tree-sprites.png';
	  }
	
	  getSprite() {
	    if (this.sprite === 'light') {
	      return TREE_SPRITES.lightTree;
	    } else {
	      return TREE_SPRITES.darkTree;
	    }
	  }
	
	  draw(ctx) {
	    const sprite = this.getSprite();
	    ctx.drawImage(
	      this.spriteSheet,
	      sprite[0],
	      sprite[1],
	      sprite[2],
	      sprite[3],
	      this.position[0],
	      this.position[1],
	      109,
	      139
	    );
	    // ctx.beginPath();
	    // ctx.rect(this.position[0] + 24, this.position[1] + 20, 62, 120);
	    // ctx.lineWidth = 1;
	    // ctx.strokeStyle = 'yellow';
	    // ctx.stroke();
	  }
	}
	
	module.exports = Tree;


/***/ },
/* 5 */
/***/ function(module, exports) {

	class Obstacle {
	  constructor(options) {
	    this.position = options.startPos;
	    this.speed = options.speed;
	    this.hitboxOffset = options.hitboxOffset;
	  }
	
	  draw(ctx) {
	    ctx.beginPath();
	    ctx.rect(this.position[0], this.position[1], 10, 50);
	    ctx.fillStyle = 'black';
	    ctx.fill();
	    ctx.lineWidth = 1;
	    ctx.strokeStyle = 'yellow';
	    ctx.stroke();
	  }
	
	  move() {
	    this.position[0] -= this.speed;
	  }
	
	  step(ctx) {
	    this.draw(ctx);
	    this.move();
	  }
	
	  outOfBounds() {
	    return this.position[0] < -150;
	  }
	
	  hitbox() {
	    return {
	      minX: this.position[0] + this.hitboxOffset.posX,
	      maxX: this.position[0] + this.hitboxOffset.posX + this.hitboxOffset.sizeX,
	      minY: this.position[1] + this.hitboxOffset.posY,
	      maxY: this.position[1] + this.hitboxOffset.posY + this.hitboxOffset.sizeY,
	    };
	  }
	
	}
	
	module.exports = Obstacle;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Obstacle = __webpack_require__(5);
	
	const BIRD_SPRITES = {
	  flying1: [4, 4, 59, 49],
	  flying2: [65, 16, 57, 38],
	  flying3: [124, 15, 65, 39]
	};
	
	const TREE_HITBOX_OFFSET = {
	  posX: 3,
	  posY: 16,
	  sizeX: 52,
	  sizeY: 15,
	};
	
	class Bird extends Obstacle {
	  constructor(options) {
	    options.hitboxOffset = TREE_HITBOX_OFFSET;
	    super(options);
	    this.spriteSheet = new Image();
	    this.spriteSheet.src = './assets/images/bird-sprites.png';
	    this.flyCycle = 0;
	  }
	
	  getSprite() {
	    if (this.flyCycle < 8) {
	      this.flyCycle += 1;
	      return BIRD_SPRITES.flying1;
	    } else if (this.flyCycle < 14) {
	      this.flyCycle += 1;
	      return BIRD_SPRITES.flying2;
	    } else if (this.flyCycle < 25) {
	      this.flyCycle +=1;
	      return BIRD_SPRITES.flying3;
	    } else if (this.flyCycle < 30) {
	      this.flyCycle +=1;
	      return BIRD_SPRITES.flying2;
	    } else {
	      this.flyCycle = 0;
	      return BIRD_SPRITES.flying2;
	    }
	  }
	
	  draw(ctx) {
	    const sprite = this.getSprite();
	    ctx.drawImage(
	      this.spriteSheet,
	      sprite[0],
	      sprite[1],
	      sprite[2],
	      sprite[3],
	      this.position[0],
	      this.position[1],
	      sprite[2],
	      sprite[3]
	    );
	    // ctx.beginPath();
	    // ctx.rect(this.position[0] + 3, this.position[1] + 20, 52, 15);
	    // ctx.lineWidth = 1;
	    // ctx.strokeStyle = 'yellow';
	    // ctx.stroke();
	  }
	}
	
	module.exports = Bird;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(8);
	
	class Score {
	  constructor(multiplier) {
	    this.score = 0;
	    this.multiplier = multiplier;
	    const scoreCookie = Util.readCookie('localHighScores');
	    if (scoreCookie) {
	      this.localHighScores = JSON.parse(scoreCookie);
	    } else {
	      this.localHighScores = [
	        [ 'dio', 15000 ],
	        [ 'dio', 12000 ],
	        [ 'dio', 8000 ],
	        [ 'dio', 4000 ],
	        [ 'dio', 1000 ]
	      ];
	    }
	  }
	
	  draw(ctx) {
	    const text = `Score: ${this.score}`;
	    ctx.font = '30px VT323';
	    ctx.strokeStyle = 'black';
	    ctx.lineWidth = 4;
	    ctx.fillStyle = 'white';
	    ctx.textAlign = 'left';
	    ctx.strokeText(text, 640, 40);
	    ctx.fillText(text, 640, 40);
	    this.increaseScore();
	  }
	
	  increaseScore() {
	    this.score += this.multiplier;
	  }
	
	  setScore() {
	    const scoreboard = document.getElementById('local-high-scores');
	    while (scoreboard.firstChild) {
	      scoreboard.removeChild(scoreboard.firstChild);
	    }
	    this.localHighScores.forEach((highScore)=> {
	      const score = document.createElement('li');
	      score.innerHTML = `${highScore[0]} <span class="right-score">${Util.numberWithCommas(highScore[1])}</span>`;
	      scoreboard.appendChild(score);
	    });
	    const jsonScores = JSON.stringify(this.localHighScores);
	    Util.createCookie('localHighScores', jsonScores);
	  }
	
	  checkHighScore() {
	    for (let i = 0; i < this.localHighScores.length; i++) {
	      if (this.score > this.localHighScores[i][1]) {
	        return i;
	      }
	    }
	    return -1;
	  }
	
	  updateLocalHighScore(idx, name) {
	    this.localHighScores[idx][0] = name;
	    this.localHighScores[idx][1] = this.score;
	  }
	
	}
	
	module.exports = Score;


/***/ },
/* 8 */
/***/ function(module, exports) {

	const Util = {
	  getRandomIntInclusive(min, max) {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	  },
	  numberWithCommas(x) {
	    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	  },
	  createCookie(name, value, days) {
	    let expires = "";
	    if (days) {
	        const date = new Date();
	        date.setTime(date.getTime() + (days*24*60*60*1000));
	        expires = "; expires=" + date.toUTCString();
	    }
	    document.cookie = name + "=" + value + expires + "; path=/";
	  },
	  readCookie(name) {
	    const nameEQ = name + "=";
	    const ca = document.cookie.split(';');
	    for(let i = 0;i < ca.length;i++) {
	        const c = ca[i];
	        while (c.charAt(0) === ' ') c = c.substring(1,c.length);
	        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
	    }
	    return null;
	  }
	};
	
	module.exports = Util;


/***/ },
/* 9 */
/***/ function(module, exports) {

	const drawGameOver = (ctx) => {
	  const text1 = 'GAME OVER';
	  const text2 = 'Press \'r\' to reset the game';
	  ctx.font = '48px VT323';
	  ctx.fillStyle = '#fef86c';
	  ctx.textAlign = 'center';
	  ctx.strokeText(text1, 400, 150);
	  ctx.fillText(text1, 400, 150);
	  ctx.font = '32px VT323';
	  ctx.strokeText(text2, 400, 180);
	  ctx.fillText(text2, 400, 180);
	};
	
	module.exports = drawGameOver;


/***/ },
/* 10 */
/***/ function(module, exports) {

	const closeMainMenu = () => {
	  const mainMenu = document.getElementsByClassName('main-menu')[0];
	  mainMenu.className = 'main-menu close';
	};
	
	const openMainMenu = () => {
	  const mainMenu = document.getElementsByClassName('main-menu')[0];
	  mainMenu.className = 'main-menu';
	};
	
	
	const Menu = {
	  setMenuButtons(game) {
	    const easyButton = document.getElementById('easy-button');
	    const mediumButton = document.getElementById('medium-button');
	    const hardButton = document.getElementById('hard-button');
	    const aboutButton = document.getElementById('how-to-play-button');
	    const closeAboutButton = document.getElementById('close-how-to-play');
	    const menuButton = document.getElementById('menu-button');
	    const submitHighScoreButton = document.getElementById('submit-highscore');
	    const muteButton = document.getElementById('mute-button');
	    const selectSound = new Audio('./assets/sounds/select.wav');
	
	    const openAbout = (e) => {
	      const aboutScreen = document.getElementsByClassName('how-to-play-container')[0];
	      if (aboutScreen.className.indexOf('how-to-play-open') !== -1) {
	        aboutScreen.className = 'how-to-play-container group';
	        playSelectSound();
	        game.unpause();
	      } else {
	        aboutScreen.className += ' how-to-play-open';
	        playSelectSound();
	        game.pause();
	      }
	    };
	
	    const playSelectSound = () => {
	      selectSound.pause();
	      selectSound.currentTime = 0;
	      selectSound.play();
	    };
	
	    const backToMenu = () => {
	      game.gameOver = true;
	      game.gamePlaying = false;
	      game.backgroundMusic.pause();
	      game.backgroundMusic.currentTime = 0;
	      playSelectSound();
	      game.openMenu();
	      document.getElementById('game-over-menu').className += ' close';
	      openMainMenu();
	      game.ctx.clearRect(0, 0, 800, 300);
	      document.getElementById('game-canvas').focus();
	    };
	
	    const submitScore = (e) => {
	      e.preventDefault();
	      const nameInput = document.getElementById('name-input');
	      game.setScore(nameInput.value);
	      nameInput.value = '';
	      game.highScoreInput.className += ' close';
	      playSelectSound();
	      document.getElementById('game-canvas').focus();
	    };
	
	    const muteToggle = (e) => {
	      if (game.toggleMute()) {
	        muteButton.className = 'toggled';
	      } else {
	        muteButton.className = '';
	      }
	      playSelectSound();
	      document.getElementById('game-canvas').focus();
	    };
	
	    game.gameCanvas.addEventListener('keydown', (e)=> {
	      if (e.code === 'Escape' && game.gamePlaying) {
	        e.preventDefault();
	        backToMenu();
	      }
	    });
	    muteButton.addEventListener('click', muteToggle);
	    menuButton.addEventListener('click', backToMenu);
	    aboutButton.addEventListener('click', openAbout);
	    closeAboutButton.addEventListener('click', openAbout);
	    submitHighScoreButton.addEventListener('click', submitScore);
	    hardButton.addEventListener('click', (e) => {
	        closeMainMenu();
	        playSelectSound();
	        setTimeout(()=> game.start('hard'), 200);
	      }
	    );
	    mediumButton.addEventListener('click', (e) => {
	        closeMainMenu();
	        playSelectSound();
	        setTimeout(()=> game.start('medium'), 200);
	      }
	    );
	    easyButton.addEventListener('click', (e) => {
	        closeMainMenu();
	        playSelectSound();
	        setTimeout(()=> game.start('easy'), 200);
	      }
	    );
	  },
	  closeMainMenu: closeMainMenu,
	  openMainMenu: openMainMenu,
	};
	
	module.exports = Menu;


/***/ },
/* 11 */
/***/ function(module, exports) {

	const Difficulty = {
	  'hard': {
	    birds: true,
	    multiplier: 7,
	    maxTrees: 3,
	    maxObstacles: 10,
	  },
	  'medium': {
	    birds: false,
	    multiplier: 3,
	    maxTrees: 3,
	    maxObstacles: 7,
	  },
	  'easy': {
	    birds: false,
	    multiplier: 1,
	    maxTrees: 1,
	    maxObstacles: 6,
	  }
	};
	
	module.exports = Difficulty;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map