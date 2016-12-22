class Background {
  constructor(ctx) {
    this.image = new Image();
    this.image.src = './assets/images/scrolling-background.jpg';
    this.speed = 1.5;
    this.x = 0;
    this.y = -20;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y);
    this.ctx.drawImage(this.image, this.x + 1438, this.y);
    if (this.x <= -1438) {
      this.x = 0;
    }
    this.scrollImage();
  }

  scrollImage() {
    this.x -= this.speed;
  }

}

module.exports = Background;
