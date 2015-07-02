/**
 * @module Application
 * @class Functions
 */
define([
    'modules/utils/IntervalQuantifier',
    'modules/utils/Mapper',
    'modules/utils/PinyinConverter',
    'modules/utils/Recognizer',
    'modules/utils/Shortstraw'
], function(IntervalQuantifier, Mapper, PinyinConverter, Recognizer, Shortstraw) {

    /**
     * @property interval
     * @type {IntervalQuantifier}
     */
    var interval = new IntervalQuantifier();

    /**
     * @property mapper
     * @typeof {Mapper}
     */
    var mapper = Mapper;

    /**
     * @property pinyin
     * @type {PinyinConverter}
     */
    var pinyin = PinyinConverter;

    /**
     * @property recognizer
     * @type {Recognizer}
     */
    var recognizer = new Recognizer();

    /**
     * @property shortstraw
     * @type Shortstraw
     */
    var shortstraw = new Shortstraw();

    /**
     * @method addAllObjectAttributes
     * @param {Array} array
     * @param {String} attribute
     * @returns {Number}
     */
    function addAllObjectAttributes(array, attribute) {
        var total = 0;
        for (var i = 0, length = array.length; i < length; i++) {
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
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        if (bytes > 0) {
            var value = parseFloat(Math.floor(Math.log(bytes) / Math.log(1024)));
            return (bytes / Math.pow(1024, value)).toFixed(2) + ' ' + sizes[value];
        }
        return '0 B';
    }

    /**
     * @method convertTimeToClock
     * @param {Number} time
     */
    function convertTimeToClock(time) {
        var hours = (time / (3600 * 1000)) >> 0;
        time = time % (3600 * 1000);
        var minutes = (time / (60 * 1000)) >> 0;
        time = time % (60 * 1000);
        var seconds = (time / 1000) >> 0;
        if (hours > 0) {
            return hours + ':' + pad(minutes, 0, 2) + ':' + pad(seconds, 0, 2);
        }
        return minutes + ':' + pad(seconds, 0, 2);
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
        var p1 = Array.isArray(point1) ? point1[0] : point1;
        var p2 = Array.isArray(point1) ? point1[point1.length - 1] : point2;
        var xDiff = p2.x - p1.x;
        var yDiff = p2.y - p1.y;
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
        var left = areaWidth;
        var top = 0.0;
        var right = 0.0;
        var bottom = areaHeight;
        for (var i = 0, length = points.length; i < length; i++) {
            var x = points[i].x;
            var y = points[i].y;
            if (x - pointRadius < left)
                left = x - pointRadius;
            if (y + pointRadius > top)
                top = y + pointRadius;
            if (x + pointRadius > right)
                right = x + pointRadius;
            if (y - pointRadius < bottom)
                bottom = y - pointRadius;
        }
        var width = right - left;
        var height = top - bottom;
        var center = {x: width / 2 + left, y: height / 2 + bottom};
        return {x: left, y: bottom, width: width, height: height, center: center};
    }

    /**
     * @method getDistance
     * @param {createjs.Point|Object} point1
     * @param {createjs.Point|Object} point2
     * @return {Number}
     */
    function getDistance(point1, point2) {
        var xs = point2.x - point1.x;
        xs = xs * xs;
        var ys = point2.y - point1.y;
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
        var total = 0;
        if (points.length > 1) {
            for (var i = 1, length = points.length; i < length; i++) {
                total += getDistance(points[i-1], points[i]);
            }
        }
        return total;
    }

    /**
     * @method hasKana
     * @param {String} text
     * @returns {Boolean}
     */
    function hasKana(text) {
        var chars = text.split('');
        if (chars.length > 0) {
            for (var i = 0, length = chars.length; i < length; i++) {
                var charCode = text.charCodeAt(i);
                if ((charCode >= 12353 && charCode <= 12436) ||
                    (charCode >= 12449 && charCode <= 12540) ||
                    charCode === 65374) {
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
        var chars = text.split('');
        if (chars.length > 0) {
            for (var i = 0, length = chars.length; i < length; i++) {
                var charCode = text.charCodeAt(i);
                if (!(charCode >= 12353 && charCode <= 12436) &&
                    !(charCode >= 12449 && charCode <= 12540) &&
                    charCode !== 65374) {
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
        var image = new Image();
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
        for (var key in object2) {
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
        var string = text + '';
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

    return {
        addAllObjectAttributes: addAllObjectAttributes,
        arrayToInt: arrayToInt,
        arrayToJSON: arrayToJSON,
        convertTimeToClock: convertTimeToClock,
        convertBytesToSize: convertBytesToSize,
        formatDate: formatDate,
        getAngle: getAngle,
        getBoundingRectangle: getBoundingRectangle,
        getDistance: getDistance,
        getGuid: getGuid,
        getLength: getLength,
        hasKana: hasKana,
        imageExists: imageExists,
        interval: interval,
        isKana: isKana,
        isNumber: isNumber,
        mapper: mapper,
        mergeObjectArrays: mergeObjectArrays,
        pad: pad,
        pinyin: pinyin,
        randomDecimal: randomDecimal,
        recognizer: recognizer,
        shortstraw: shortstraw,
        textToHTML: textToHTML,
        toLowerCase: toLowerCase,
        toUpperCase: toUpperCase
    };

});