const Obstacle = require('./obstacles');

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
