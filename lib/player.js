class Player {
  constructor(options) {
    this.position = options.position;
    this.falling = false;
  }

  jump() {
    if (this.position[1] > 100 && !this.falling) {
      this.position[1] -= 2;
    } else {
      this.falling = true;
    }
  }

  fall() {
    if (this.position[1] < 220 && this.falling) {
      this.position[1] += 2;
    } else {
      this.falling = false;
    }
  }

  draw(ctx) {
    ctx.clearRect(0, 0, 300, 800);
    ctx.beginPath();
    ctx.rect(this.position[0], this.position[1], 10, 50);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'yellow';
    ctx.stroke();
  }

  update(ctx) {
    this.jump();
    this.fall();
    this.draw(ctx);
  }

}

module.exports = Player;
