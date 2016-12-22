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
