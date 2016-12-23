class Score {
  constructor(multiplier) {
    this.score = 0;
    this.multiplier = multiplier;
    this.highScores = [20000, 16000, 12000, 8000, 4000];
    this.highScoreNames = ['Dio', 'Dio', 'Dio', 'Dio', 'Dio'];
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
}

module.exports = Score;
