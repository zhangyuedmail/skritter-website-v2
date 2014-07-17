define([
    'function/Bootstrap',
    'function/ChineseMap',
    'function/PinyinMap',
    'function/Recognizer',
    'function/Shortstraw',
    'function/StrokeShapeMap'
], function(Bootstrap, ChineseMap, PinyinMap, Recognizer, Shortstraw, StrokeShapeMap) {
    /**
     * @method addAll
     * @param {Array} array
     * @param {String} attribute
     * @returns {Number}
     */
    var addAll = function(array, attribute) {
        var total = 0;
        for (var i = 0, length = array.length; i < length; i++) {
            var value = array[i][attribute];
            if (value) {
                total += value;
            }
        }
        return total;
    };
    /**
     * @property {Object} bootstrap
     */
    var bootstrap = Bootstrap;
    /**
     * @method calculateInterval
     * @param {Object} item
     * @param {Number} score
     * @param {Object} srsconfigs
     * @returns {Number}
     */
    var calculateInterval = function(item, score, srsconfigs) {
            var newInterval = null;
            //return new items with randomized default config values
            if (!item.last) {
                switch (score) {
                    case 1:
                        newInterval = srsconfigs.initialWrongInterval;
                        break;
                    case 2:
                        newInterval = srsconfigs.initialRightInterval / 5;
                        break;
                    case 3:
                        newInterval = srsconfigs.initialRightInterval;
                        break;
                    case 4:
                        newInterval = srsconfigs.initialRightInterval * 4;
                        break;
                }
                return randomInterval(newInterval);
            }
            //set values for further calculations
            var actualInterval = getUnixTime() - item.last;
            var factor;
            var pctRight = item.successes / item.reviews;
            var scheduledInterval = item.next - item.last;
            //get the factor
            if (score === 2) {
                factor = 0.9;
            } else if (score === 4) {
                factor = 3.5;
            } else {
                var factorsList = (score === 1) ? srsconfigs.wrongFactors : srsconfigs.rightFactors;
                var divisions = [2, 1200, 18000, 691200];
                var index;
                for (var i in divisions) {
                    if (item.interval > divisions[i]) {
                        index = i;
                    }
                }
                factor = factorsList[index];
            }
            //adjust the factor based on readiness
            if (score > 2) {
                factor -= 1;
                factor *= actualInterval / scheduledInterval;
                factor += 1;
            }
            //accelerate new items that appear to be known
            if (item.successes === item.reviews && item.reviews < 5) {
                factor *= 1.5;
            }
            //decelerate hard items consistently marked wrong
            if (item.reviews > 8) {
                if (pctRight < 0.5) {
                    factor *= Math.pow(pctRight, 0.7);
                }
            }
            //multiple by the factor and randomize the interval
            newInterval = randomInterval(item.interval * factor);
            //bound the interval
            if (score === 1) {
                if (newInterval > 604800) {
                    newInterval = 604800;
                } else if (newInterval < 30) {
                    newInterval = 30;
                }
            } else {
                if (newInterval > 315569260) {
                    newInterval = 315569260;
                } else if (score === 2 && newInterval < 300) {
                    newInterval = 300;
                } else if (newInterval < 30) {
                    newInterval = 30;
                }
            }
            return newInterval;
    };
    /**
     * @method convertArrayToInt
     * @param {Array} array
     * @returns {Array}
     */
    var convertArrayToInt = function(array) {
        return array.map(function(value) {
            return parseInt(value, 10);
        });
    };
    /**
     * @method convertBytesToSize
     * @param {Number} bytes
     * @returns {String}
     */
    var convertBytesToSize = function(bytes) {
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        if (bytes > 0) {
            var value = window.parseFloat(Math.floor(Math.log(bytes) / Math.log(1024)));
            return (bytes / Math.pow(1024, value)).toFixed(2) + ' ' + sizes[value];
        }
    };
    /**
     * @method getAngle
     * @param {Array|Object} point1 An array of point values
     * @param {Object} point2 An array of point values
     * @return {Number} The angle formed by the first and last points
     */
    var getAngle = function(point1, point2) {
        var p1 = Array.isArray(point1) ? point1[0] : point1;
        var p2 = Array.isArray(point1) ? point1[point1.length - 1] : point2;
        var xDiff = p2.x - p1.x;
        var yDiff = p2.y - p1.y;
        return (Math.atan2(yDiff, xDiff)) * (180 / Math.PI);
    };
    /**
     * @method getBoundingRectangle
     * @param {Array} points An array of point values
     * @param {Number} areaWidth The width of the canvas area
     * @param {Number} areaHeight The height of the canvas area
     * @param {Number} pointRadius The radius of
     * @return {Object} The bounds of the calculated rectangle
     */
    var getBoundingRectangle = function(points, areaWidth, areaHeight, pointRadius) {
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
        return {x: left, y: bottom, w: width, h: height, c: center};
    };
    /**
     * @method getDate
     * @returns {String}
     */
    var getDate = function() {
        return moment(skritter.fn.getUnixTime() * 1000).format('YYYY-MM-DD');
    };
    /**
     * @method getDateTime
     * @returns {String}
     */
    var getDateTime = function(time) {
        return moment(time ? time : skritter.fn.getUnixTime() * 1000).format('YYYY-MM-DD, h:mm:ss A');
    };
    /**
     * @method getDistance
     * @param {Point} point1
     * @param {Point} point2
     * @return {Number} The distance between the first and last points
     */
    var getDistance = function(point1, point2) {
        var xs = point2.x - point1.x;
        xs = xs * xs;
        var ys = point2.y - point1.y;
        ys = ys * ys;
        return Math.sqrt(xs + ys);
    };
    /**
     * @method getDistanceFromArray
     * @param {Array} points
     * @return {Number} The distance between the first and last points
     */
    var getDistanceFromArray = function(points) {
        if (points && points.length > 1) {
            var point1 = {x: points[0].x, y: points[0].y};
            var point2 = {x: points[points.length - 1].x, y: points[points.length - 1].y}
            var xs = point2.x - point1.x;
            xs = xs * xs;
            var ys = point2.y - point1.y;
            ys = ys * ys;
            return Math.sqrt(xs + ys);
        }
        return 0;
    };
    /**
     * @method getDistanceToLineSegment
     * @param {Object} start The starting point of a line segment
     * @param {Object} end The ending point of a line segment
     * @param {Object} point Point to measure distance from the line segment
     * @return {Number} The distance from the point and line segment
     */
    var getDistanceToLineSegment = function(start, end, point) {
        var px = end.x - start.x;
        var py = end.y - start.y;
        var segment = (px * px) + (py * py);
        var z = ((point.x - start.x) * px + (point.y - start.y) * py) / parseFloat(segment);
        if (z > 1) {
            z = 1;
        } else if (z < 0) {
            z = 0;
        }
        var x = start.x + z * px;
        var y = start.y + z * py;
        var dx = x - point.x;
        var dy = y - point.y;
        return Math.sqrt((dx * dx) + (dy * dy));
    };
    /**
     * @method getGuid
     * @returns {String}
     */
    var getGuid = function() {
        return Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1);
    };
    /**
     * @method getUnixTime
     * @param {Boolean} formatMilliseconds
     * @returns {Number}
     */
    var getUnixTime = function(formatMilliseconds) {
        return formatMilliseconds ? new Date().getTime() : Math.round(new Date().getTime() / 1000);
    };
    /**
     * @method getRandomNumber
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    var getRandomNumber = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    /**
     * @method hasCordova
     * @returns {Boolean}
     */
    var hasCordova = function() {
        return window.cordova ? true : false;
    };
    /**
     * @method hasRaygun
     * @returns {Boolean}
     */
    var hasRaygun = function() {
        return window.Raygun ? true : false;
    };
    /**
     * @method isKana
     * @param {String} text
     * @returns {Boolean}
     */
    var isKana = function(text) {
        var chars = text.split('');
        if (chars.length === 0) {
            return false;
        } else {
            for (var i = 0, length = chars.length; i < length; i++) {
                var charCode = text.charCodeAt(i);
                if (!(charCode >= 12353 && charCode <= 12436) && !(charCode >= 12449 && charCode <= 12540) && charCode !== 65374) {
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * @method isNumber
     * @param {Number} number
     * @returns {Boolean}
     */
    var isNumber = function(number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    };
    /**
     * @property {Object} mapper
     */
    var mapper = ChineseMap;
    /**
     * @method mergeObjectArray
     * @param {Object} object1
     * @param {Object} object2
     * @returns {Object}
     */
    var mergeObjectArray = function(object1, object2) {
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
    };
    /**
     * @method pad
     * @param {Number|String} text The text requiring padding
     * @param {Number|String} value The value to be applied as padding
     * @param {Number} size The number of spaces of padding to be applied
     * @return {String}
     */
    var pad = function(text, value, size) {
        value = '' + value;
        var string = text + '';
        while (string.length < size) {
            string = value + '' + string;
        }
        return string;
    };
    /**
     * @property {Object} pinyin
     */
    var pinyin = PinyinMap;
    /**
     * @method randomDecimal
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    var randomDecimal = function(min, max) {
        return Math.random() * (max - min) + min;
    };
    /**
     * @method randomInterval
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    var randomInterval = function(value) {
        return Math.round(value * (0.925 + (Math.random() * 0.15)));
    };
    /**
     * @property {Object} strokes
     */
    var recognizer = new Recognizer();
    /**
     * @property {Object} strokes
     */
    var shortstraw = new Shortstraw();
    /**
     * @property {Object} strokes
     */
    var strokes = StrokeShapeMap;    
    /**
     * @method textToHTML
     * @param {String} text
     */
    var textToHTML = function(text) {
        text = text.replace(/img:(http:\/\/\S+)/gi, '<img src="$1"/>')
                .replace(/_([^ _][^_]*)_(?!\S{4})/gi, '<em>$1</em>')
                .replace(/\n/gi, '<br/>')
                .replace(/\*([^*]+)\*/gi, '<strong>$1</strong>');
        return text;
    };
    
    return {
        addAll: addAll,
        bootstrap: bootstrap,
        calculateInterval: calculateInterval,
        convertArrayToInt: convertArrayToInt,
        convertBytesToSize: convertBytesToSize,
        getAngle: getAngle,
        getBoundingRectangle: getBoundingRectangle,
        getDistance: getDistance,
        getDistanceFromArray: getDistanceFromArray,
        getDistanceToLineSegment: getDistanceToLineSegment,
        getGuid: getGuid,
        getUnixTime: getUnixTime,
        getRandomNumber: getRandomNumber,
        getDate: getDate,
        getDateTime: getDateTime,
        hasCordova: hasCordova,
        hasRaygun: hasRaygun,
        isKana: isKana,
        isNumber: isNumber,
        mapper: mapper,
        mergeObjectArray: mergeObjectArray,
        pad: pad,
        pinyin: pinyin,
        randomDecimal: randomDecimal,
        randomInterval: randomInterval,
        recognizer: recognizer,
        shortstraw: shortstraw,
        strokes: strokes,
        textToHTML: textToHTML
    };
});