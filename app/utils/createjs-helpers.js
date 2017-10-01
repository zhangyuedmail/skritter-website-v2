/**
 * Draws a dashed line using createJS graphics
 * @param {Number} x1 the starting x position of the line
 * @param {Number} y1 the starting y position of the line
 * @param {Number} x2 the ending x position of the line
 * @param {Number} y2 the ending y position of the line
 * @param {Number} dashLength how long an individual dash should be
 * @returns {createjs.Graphics}
 */
createjs.Graphics.prototype.dashedLineTo = function(x1, y1, x2, y2, dashLength) {
  const dX = x2 - x1;
  const dY = y2 - y1;
  const dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLength);
  const dashX = dX / dashes;
  const dashY = dY / dashes;
  let i = 0;

  this.moveTo(x1, y1);

  while (i++ < dashes) {
    x1 += dashX;
    y1 += dashY;
    this[i % 2 === 0 ? 'moveTo' : 'lineTo'](x1, y1);
  }
  this[i % 2 === 0 ? 'moveTo' : 'lineTo'](x2, y2);

  return this;
};
