/**
 * @module Application
 */
define([
    "application/PinyinConverter"
], function(PinyinConverter) {
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
     * @method convertBytesToSize
     * @param {Number} bytes
     * @returns {String}
     */
    function convertBytesToSize(bytes) {
        var sizes = ["B", "KB", "MB", "GB", "TB"];
        if (bytes > 0) {
            var value = parseFloat(Math.floor(Math.log(bytes) / Math.log(1024)));
            return (bytes / Math.pow(1024, value)).toFixed(2) + " " + sizes[value];
        }
        return "0 B";
    }
    /**
     * @method getAngle
     * @param {Array|createjs.Point} point1
     * @param {createjs.Point} point2
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
    function getBoundingRectangle() {
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
    }
    /**
     * @method getDistance
     * @param {createjs.Point} point1
     * @param {createjs.Point} point2
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
     * @method isKana
     * @param {String} text
     * @returns {Boolean}
     */
    function isKana(text) {
        var chars = text.split("");
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

    return {
        addAllObjectAttributes: addAllObjectAttributes,
        convertBytesToSize: convertBytesToSize,
        getAngle: getAngle,
        getBoundingRectangle: getBoundingRectangle,
        getDistance: getDistance,
        getGuid: getGuid,
        isKana: isKana,
        isNumber: isNumber,
        mergeObjectArrays: mergeObjectArrays,
        pinyin: PinyinConverter
    };
});