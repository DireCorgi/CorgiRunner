const Util = require('./util');

class Score {
  constructor(multiplier) {
    this.score = 0;
    this.multiplier = multiplier;
    this.localHighScores = [
      [ 'dio', 15000 ],
      [ 'dio', 12000 ],
      [ 'dio', 8000 ],
      [ 'dio', 4000 ],
      [ 'dio', 1000 ]
    ];
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

  setScore() {
    const scoreboard = document.getElementById('local-high-scores');
    while (scoreboard.firstChild) {
      scoreboard.removeChild(scoreboard.firstChild);
    }
    this.localHighScores.forEach((highScore)=> {
      const score = document.createElement('li');
      score.innerHTML = `${highScore[0]} <span class="right-score">${Util.numberWithCommas(highScore[1])}</span>`;
      scoreboard.appendChild(score);
    });
  }

  checkHighScore(score) {
    for (let i = 0; i < this.localHighScores.length; i++) {
      if (score > this.localHighScores[i][1]) {
        return i;
      }
    }
    return -1;
  }

}

module.exports = Score;
