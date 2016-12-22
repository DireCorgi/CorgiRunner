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
