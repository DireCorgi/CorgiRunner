class Player {

  constructor(options) {
    this.position = options.position;
    this.falling = false;
    this.jumping = false;
    this.jumpCount = 0;
  }

  jump() {
    const gravity = 0.4;
    const initialSpeed = 10;
    if (this.jumping) {
      if (this.jumpCount === 0 || !this.onGround()){
        this.position[1] -= initialSpeed - gravity * this.jumpCount;
        this.jumpCount += 1;
      } else {
        this.position[1] = 220;
        this.jumpCount = 0;
        this.jumping = false;
      }
    }
  }

  onGround() {
    return this.position[0] === 100 && this.position[1] >= 220;
  }

  toggleJump() {
    this.jumping = true;
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
    this.draw(ctx);
  }

}

module.exports = Player;
