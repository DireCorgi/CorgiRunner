const drawGameOver = (ctx) => {
  const text1 = 'GAME OVER';
  const text2 = 'Press \'r\' to reset the game';
  ctx.font = '48px VT323';
  ctx.fillStyle = '#fef86c';
  ctx.textAlign = 'center';
  ctx.strokeText(text1, 400, 150);
  ctx.fillText(text1, 400, 150);
  ctx.font = '32px VT323';
  ctx.strokeText(text2, 400, 180);
  ctx.fillText(text2, 400, 180);
};

module.exports = drawGameOver;
