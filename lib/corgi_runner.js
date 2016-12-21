const Player = require('./player.js');
const Game = require('./game.js');

document.addEventListener("DOMContentLoaded", ()=> {
  const gameCanvas = document.getElementById("game-canvas");
  const canvasContext = gameCanvas.getContext('2d');

  const game = new Game(canvasContext, gameCanvas);
  game.start();
});
