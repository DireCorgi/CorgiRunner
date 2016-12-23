const Obstacle = require('./obstacles');

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
