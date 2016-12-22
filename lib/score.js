class Score {
  constructor(multiplier) {
    this.score = 0;
    this.multiplier = multiplier;
  }

  draw(ctx) {
    ctx.font = '24px VT323';
    ctx.fillText(`Score: ${this.score}`, 650, 30);
    this.increaseScore();
  }

  increaseScore() {
    this.score += this.multiplier;
  }
}

module.exports = Score;
