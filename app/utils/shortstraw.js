/**
 * @class Shortstraw
 * @constructor
 */
function Shortstraw() {
  this.DIAGONAL_INTERVAL = 40;
  this.STRAW_WINDOW = 3;
  this.MEDIAN_THRESHOLD = 0.95;
  this.LINE_THRESHOLD = 0.80;
}

/**
 * @method boundingBox
 * @param {Array} points
 * @returns {Object}
 */
Shortstraw.prototype.boundingBox = function(points) {
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (let i = 0, len = points.length; i < len; i++) {
    let p = points[i];
    if (p.x < minX) {
      minX = p.x;
    }
    if (p.x > maxX) {
      maxX = p.x;
    }
    if (p.y < minY) {
      minY = p.y;
    }
    if (p.y > maxY) {
      maxY = p.y;
    }
  }
  return {x: minX, y: minY, w: maxX - minX, h: maxY - minY};
};

/**
 * @method determineResampleSpacing
 * @param {Array} points
 * @returns {Number}
 */
Shortstraw.prototype.determineResampleSpacing = function(points) {
  let b = this.boundingBox(points);
  let p1 = {x: b.x, y: b.y};
  let p2 = {x: b.x + b.w, y: b.y + b.h};
  let d = this.distance(p1, p2);
  return d / this.DIAGONAL_INTERVAL;
};

/**
 * @method distance
 * @param {Object} p1
 * @param {Object} p2
 * @returns {Number}
 */
Shortstraw.prototype.distance = function(p1, p2) {
  let dx = p2.x - p1.x;
  let dy = p2.y - p1.y;
  return Math.pow((dx * dx + dy * dy), 1 / 2);
};

/**
 * @method getCorners
 * @param {Array} points
 * @returns {Array}
 */
Shortstraw.prototype.getCorners = function(points) {
  let corners = [0];
  let w = this.STRAW_WINDOW;
  let straws = [];
  let i;
  for (i = w; i < points.length - w; i++) {
    straws[i] = (this.distance(points[i - w], points[i + w]));
  }
  let t = this.median(straws) * this.MEDIAN_THRESHOLD;
  for (i = w; i < points.length - w; i++) {
    if (straws[i] < t) {
      let localMin = Number.POSITIVE_INFINITY;
      let localMinIndex = i;
      while (i < straws.length && straws[i] < t) {
        if (straws[i] < localMin) {
          localMin = straws[i];
          localMinIndex = i;
        }
        i++;
      }
      corners.push(localMinIndex);
    }
  }
  corners.push(points.length - 1);
  corners = this.postProcessCorners(points, corners, straws);
  return corners;
};

/**
 * @method halfwayCorner
 * @param {Array} straws
 * @param {Object} a
 * @param {Object} b
 * @returns {Number}
 */
Shortstraw.prototype.halfwayCorner = function(straws, a, b) {
  let quarter = (b - a) / 4;
  let minValue = Number.POSITIVE_INFINITY;
  let minIndex;
  for (let i = a + quarter; i < (b - quarter); i++) {
    if (straws[i] < minValue) {
      minValue = straws[i];
      minIndex = i;
    }
  }
  return minIndex;
};

/**
 * @method isLine
 * @param {Array} points
 * @param {Object} a
 * @param {Object} b
 * @returns {Boolean}
 */
Shortstraw.prototype.isLine = function(points, a, b) {
  let distance = this.distance(points[a], points[b]);
  let pathDistance = this.pathDistance(points, a, b);
  return (distance / pathDistance) > this.LINE_THRESHOLD;
};

/**
 * @method median
 * @param {Array} values
 * @returns {Number}
 */
Shortstraw.prototype.median = function(values) {
  let s = values.concat();
  s.sort();
  let m;
  if (s.length % 2 === 0) {
    m = s.length / 2;
    return (s[m - 1] + s[m]) / 2;
  }
  m = (s.length + 1) / 2;
  return s[m - 1];
};

/**
 * @method pathDistance
 * @param {Array} points
 * @param {Object} a
 * @param {Object} b
 * @returns {Number}
 */
Shortstraw.prototype.pathDistance = function(points, a, b) {
  let d = 0;
  for (let i = a; i < b; i++) {
    d += this.distance(points[i], points[i + 1]);
  }
  return d;
};

/**
 * @method postProcessCorners
 * @param {Array} points
 * @param {Array} corners
 * @param {Array} straws
 * @returns {Array}
 */
Shortstraw.prototype.postProcessCorners = function(points, corners, straws) {
  let go = false;
  let i, c1, c2;
  while (!go) {
    go = true;
    for (i = 1; i < corners.length; i++) {
      c1 = corners[i - 1];
      c2 = corners[i];
      if (!this.isLine(points, c1, c2)) {
        let newCorner = this.halfwayCorner(straws, c1, c2);
        if (newCorner > c1 && newCorner < c2) {
          corners.splice(i, 0, newCorner);
          go = false;
        }
      }
    }
  }
  for (i = 1; i < corners.length - 1; i++) {
    c1 = corners[i - 1];
    c2 = corners[i + 1];
    if (this.isLine(points, c1, c2)) {
      corners.splice(i, 1);
      i--;
    }
  }
  return corners;
};

/**
 * @method process
 * @param {Array} points
 * @returns {Array}
 */
Shortstraw.prototype.process = function(points) {
  if (points && Array.isArray(points) && points.length > 0) {
    let s = this.determineResampleSpacing(points);
    let resampled = this.resamplePoints(points, s);
    let corners = this.getCorners(resampled);
    let cornerPoints = [];
    for (let i = 0, len = corners.length; i < len; i++) {
cornerPoints.push(resampled[corners[i]]);
}
    return cornerPoints;
  } else {
    return [];
  }
};

/**
 * @method resamplePoints
 * @param {Array} points
 * @param {Object} s
 * @returns {Array}
 */
Shortstraw.prototype.resamplePoints = function(points, s) {
  let distance = 0;
  let resampled = [];
  resampled.push(points[0]);
  for (let i = 1; i < points.length; i++) {
    let p1 = points[i - 1];
    let p2 = points[i];
    let d2 = this.distance(p1, p2);
    if ((distance + d2) >= s) {
      let qx = p1.x + ((s - distance) / d2) * (p2.x - p1.x);
      let qy = p1.y + ((s - distance) / d2) * (p2.y - p1.y);
      let q = {x: qx, y: qy};
      resampled.push(q);
      points.splice(i, 0, q);
      distance = 0;
    } else {
      distance += d2;
    }
  }
  resampled.push(points[points.length - 1]);
  return resampled;
};

module.exports = Shortstraw;
