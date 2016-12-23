const Player = require('./player.js');
const Game = require('./game.js');

document.addEventListener('DOMContentLoaded', ()=> {
  const gameCanvas = document.getElementById('game-canvas');
  const canvasContext = gameCanvas.getContext('2d');

  const backgroundCanvas = document.getElementById('background-canvas');
  const backgroundCanvasContext = backgroundCanvas.getContext('2d');

  const foregroundCanvas = document.getElementById('foreground-canvas');
  const foregroundCanvasContext = foregroundCanvas.getContext('2d');

  const game = new Game(
    canvasContext,
    gameCanvas,
    backgroundCanvasContext,
    foregroundCanvasContext
  );

});
