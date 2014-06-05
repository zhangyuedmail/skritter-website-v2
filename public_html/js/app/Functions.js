define([
    'function/Bootstrap',
    'function/ChineseMap',
    'function/PinyinConverter',
    'function/Recognizer',
    'function/Shortstraw',
    'function/StrokeShapeMap'
], function(Bootstrap, ChineseMap, PinyinConverter, Recognizer, Shortstraw, StrokeShapeMap) {
    /**
     * @property {Object} bootstrap
     */
    var bootstrap = Bootstrap;
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
     * @method hasCordova
     * @returns {Boolean}
     */
    var hasCordova = function() {
        return window.cordova ? true : false;
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
     * @property {Object} pinyin
     */
    var pinyin = PinyinConverter;
    /**
     * @property {Object} strokes
     */
    var recognizer = Recognizer;
    /**
     * @property {Object} strokes
     */
    var shortstraw = Shortstraw;
    /**
     * @property {Object} strokes
     */
    var strokes = StrokeShapeMap;

    return {
        bootstrap: bootstrap,
        convertBytesToSize: convertBytesToSize,
        getAngle: getAngle,
        getDistance: getDistance,
        getGuid: getGuid,
        getUnixTime: getUnixTime,
        hasCordova: hasCordova,
        isKana: isKana,
        isNumber: isNumber,
        mapper: mapper,
        pinyin: pinyin,
        recognizer: recognizer,
        shortstraw: shortstraw,
        strokes: strokes
    };
});