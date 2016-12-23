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
    ctx.beginPath();
    ctx.rect(this.position[0] + 3, this.position[1] + 9, 27, 50);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'yellow';
    ctx.stroke();
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
