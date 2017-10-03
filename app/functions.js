const IntervalQuantifier = require('utils/interval-quantifier');
const Mapper = require('utils/mapper');
const PinyinConverter = require('utils/pinyin-converter');
const Recognizer = require('utils/recognizer');
const Shortstraw = require('utils/shortstraw');

/**
 * @property interval
 * @type {IntervalQuantifier}
 */
const interval = new IntervalQuantifier();

/**
 * @property mapper
 * @typeof {Mapper}
 */
const mapper = Mapper;

/**
 * @property pinyin
 * @type {PinyinConverter}
 */
const pinyin = PinyinConverter;

/**
 * @property recognizer
 * @type {Recognizer}
 */
const recognizer = new Recognizer();

/**
 * @property shortstraw
 * @type Shortstraw
 */
const shortstraw = new Shortstraw();

/**
 * @method addAllObjectAttributes
 * @param {Array} array
 * @param {String} attribute
 * @returns {Number}
 */
function addAllObjectAttributes(array, attribute) {
  let total = 0;
  for (let i = 0, length = array.length; i < length; i++) {
    if (array[i][attribute]) {
      total += array[i][attribute];
    }
  }
  return total;
}

/**
 * @method arrayToJSON
 * @param {Array} array
 * @returns {Array}
 */
function arrayToJSON(array) {
  return array.map(function(data) {
    return data.toJSON();
  });
}

/**
 * @method arrayToInt
 * @param {Array} array
 * @returns {Array}
 */
function arrayToInt(array) {
  return array.map(function(value) {
    return parseInt(value, 10);
  });
}

/**
 * @method convertBytesToSize
 * @param {Number} bytes
 * @returns {String}
 */
function convertBytesToSize(bytes) {
  let sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes > 0) {
    let value = parseFloat(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, value)).toFixed(2) + ' ' + sizes[value];
  }
  return '0 B';
}

/**
 * @method convertTimeToClock
 * @param {Number} time
 */
function convertTimeToClock(time) {
  let hours = (time / (3600 * 1000)) >> 0;
  time = time % (3600 * 1000);
  let minutes = (time / (60 * 1000)) >> 0;
  time = time % (60 * 1000);
  let seconds = (time / 1000) >> 0;
  if (hours > 0) {
    return pad(hours, 0, 2) + ':' + pad(minutes, 0, 2) + ':' + pad(seconds, 0, 2);
  }
  return pad(minutes, 0, 2) + ':' + pad(seconds, 0, 2);
}

/**
 * @method formatDate
 * @param {Number} timestamp
 */
function formatDate(timestamp) {
  return Moment(timestamp * 1000).format('MMMM Do YYYY');
}

/**
 * @method getAngle
 * @param {Array|createjs.Point|Object} point1
 * @param {createjs.Point|Object} point2
 * @return {Number}
 */
function getAngle(point1, point2) {
  let p1 = Array.isArray(point1) ? point1[0] : point1;
  let p2 = Array.isArray(point1) ? point1[point1.length - 1] : point2;
  let xDiff = p2.x - p1.x;
  let yDiff = p2.y - p1.y;
  return (Math.atan2(yDiff, xDiff)) * (180 / Math.PI);
}

/**
 * @method getBoundingRectangle
 * @param {Array} points
 * @param {Number} areaWidth
 * @param {Number} areaHeight
 * @param {Number} pointRadius
 * @return {Object}
 */
function getBoundingRectangle(points, areaWidth, areaHeight, pointRadius) {
  let left = areaWidth;
  let top = 0.0;
  let right = 0.0;
  let bottom = areaHeight;
  for (let i = 0, length = points.length; i < length; i++) {
    let x = points[i].x;
    let y = points[i].y;
    if (x - pointRadius < left) {
left = x - pointRadius;
}
    if (y + pointRadius > top) {
top = y + pointRadius;
}
    if (x + pointRadius > right) {
right = x + pointRadius;
}
    if (y - pointRadius < bottom) {
bottom = y - pointRadius;
}
  }
  let width = right - left;
  let height = top - bottom;
  let center = {x: width / 2 + left, y: height / 2 + bottom};
  return {x: left, y: bottom, width: width, height: height, center: center};
}

/**
 * @method getCookie
 * @param {String} name
 * @returns {String}
 */
function getCookie(name) {
  let value = '; ' + document.cookie;
  let parts = value.split('; ' + name + '=');
  if (parts.length == 2) {
    return parts.pop().split(';').shift();
  }
}

/**
 * @method getDistance
 * @param {createjs.Point|Object} point1
 * @param {createjs.Point|Object} point2
 * @return {Number}
 */
function getDistance(point1, point2) {
  let xs = point2.x - point1.x;
  xs = xs * xs;
  let ys = point2.y - point1.y;
  ys = ys * ys;
  return Math.sqrt(xs + ys);
}

/**
 * @method getGuid
 * @returns {String}
 */
function getGuid() {
  return Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1);
}

/**
 * @method getLength
 * @param {Array} points
 * @return {Number}
 */
function getLength(points) {
  let total = 0;
  if (points.length > 1) {
    for (let i = 1, length = points.length; i < length; i++) {
      total += getDistance(points[i - 1], points[i]);
    }
  }
  return total;
}

/**
 * Gets the value of a URL parameter by its name
 * @param {String} name the name of the parameter to look for
 * @param {String} [url] the URL string to look in. Defaults to window.location.href.
 * @returns {String} the value of the parameter, if it is found
 */
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * @method hasKana
 * @param {String} text
 * @returns {Boolean}
 */
function hasKana(text) {
  let chars = text.split('');
  if (chars.length > 0) {
    for (let i = 0, length = chars.length; i < length; i++) {
      let charCode = text.charCodeAt(i);
      if ((charCode >= 12353 && charCode <= 12436) ||
        (charCode >= 12449 && charCode <= 12540)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * @method isKana
 * @param {String} text
 * @returns {Boolean}
 */
function isKana(text) {
  let chars = text.split('');

  if (chars.length > 0) {
    for (let i = 0, length = chars.length; i < length; i++) {
      let charCode = text.charCodeAt(i);

      if (!(charCode >= 12353 && charCode <= 12436) &&
        !(charCode >= 12449 && charCode <= 12540)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * @method imageExists
 * @param {String} src
 * @param {Function} callbackSuccess
 * @param {Function} [callbackError]
 */
function imageExists(src, callbackSuccess, callbackError) {
  let image = new Image();
  image.onload = function() {
    callbackSuccess(image);
  };
  image.onerror = function() {
    if (typeof callbackError === 'function') {
      callbackError();
    }
  };
  image.src = src;
}

/**
 * @method isNumber
 * @returns {Boolean}
 */
function isNumber() {
  return !isNaN(parseFloat(number)) && isFinite(number);
}

/**
 * @method mergeObjectArrays
 * @param {Object} object1
 * @param {Object} object2
 * @returns {Object}
 */
function mergeObjectArrays(object1, object2) {
  for (let key in object2) {
    if (object1[key]) {
      if (Array.isArray(object1[key])) {
        object1[key] = object1[key].concat(object2[key]);
      } else {
        object1[key] = object2[key];
      }
    } else {
      object1[key] = object2[key];
    }
  }
  return object1;
}

/**
 * @method pad
 * @param {Number|String} text
 * @param {Number|String} value
 * @param {Number} size
 * @return {String}
 */
function pad(text, value, size) {
  value = '' + value;
  let string = text + '';
  while (string.length < size) {
    string = value + '' + string;
  }
  return string;
}

/**
 * @method randomDecimal
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
function randomDecimal(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * @method textToHTML
 * @param {String} text
 */
function textToHTML(text) {
  if (!text) {
    return '';
  }
  return text
    .replace(/img:(http:\/\/\S+)/gi, '<img src="$1"/>')
    .replace(/_([^ _][^_]*)_(?!\S{4})/gi, '<em>$1</em>')
    .replace(/\n/gi, '<br/>')
    .replace(/\*([^*]+)\*/gi, '<strong>$1</strong>');
}

/**
 * @method toLowerCase
 * @param {String} value
 * @returns {String}
 */
function toLowerCase(value) {
  return value.toLowerCase();
}

/**
 * @method toUpperCase
 * @param {String} value
 * @returns {String}
 */
function toUpperCase(value) {
  return value.toUpperCase();
}

module.exports = {
  interval: interval,
  mapper: mapper,
  pinyin: pinyin,
  recognizer: recognizer,
  shortstraw: shortstraw,
  addAllObjectAttributes: addAllObjectAttributes,
  arrayToInt: arrayToInt,
  arrayToJSON: arrayToJSON,
  convertTimeToClock: convertTimeToClock,
  convertBytesToSize: convertBytesToSize,
  formatDate: formatDate,
  getAngle: getAngle,
  getBoundingRectangle: getBoundingRectangle,
  getDistance: getDistance,
  getCookie: getCookie,
  getGuid: getGuid,
  getLength: getLength,
  getParameterByName: getParameterByName,
  hasKana: hasKana,
  imageExists: imageExists,
  isKana: isKana,
  isNumber: isNumber,
  mergeObjectArrays: mergeObjectArrays,
  pad: pad,
  randomDecimal: randomDecimal,
  textToHTML: textToHTML,
  toLowerCase: toLowerCase,
  toUpperCase: toUpperCase,
};
