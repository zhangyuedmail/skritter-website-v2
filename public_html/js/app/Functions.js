/**
 * This class module contains numerous helper functions that are used throughout the application.
 * Additional functions used repeatedly shoud also be stored here. They are stored in the global skritter namespace.
 * 
 * @module Skritter
 * @class Functions
 * @param Bootstrap
 * @param ParamMap
 * @param PinyinConverter
 * @param Recognizer
 * @param Scheduler
 * @param Shortstraw
 * @param SimpTradMap
 * @param StrokeMap
 * @author Joshua McFarland
 */
define([
    'functions/Bootstrap',
    'functions/ParamMap',
    'functions/PinyinConverter',
    'functions/Recognizer',
    'functions/Scheduler',
    'functions/Shortstraw',
    'functions/SimpTradMap',
    'functions/StrokeMap'
], function(Bootstrap, ParamMap, PinyinConverter, Recognizer, Scheduler, Shortstraw, SimpTradMap, StrokeMap) {
    /**
     * @method angle
     * @param {Array} points An array of point values
     * @return {Number} The angle formed by the first and last points
     */
    var angle = function(points) {
        var point1 = points[0];
        var point2 = points[points.length - 1];
        var xDiff = point2.x - point1.x;
        var yDiff = point2.y - point1.y;
        return (Math.atan2(yDiff, xDiff)) * (180 / Math.PI);
    };
    /**
     * Parses through and array attempting to convert each value to an int.
     * 
     * @method arrayToInt
     * @param {Array} array
     * @returns {Array}
     */
    var arrayToInt = function(array) {
        return array.map(function(value) {
            return parseInt(value, 10);
        });
    };
    /**
     * @property {Object} bootstrap
     */
    var bootstrap = Bootstrap;
    /**
     * @method boundingRectangle
     * @param {Array} points An array of point values
     * @param {Number} areaWidth The width of the canvas area
     * @param {Number} areaHeight The height of the canvas area
     * @param {Number} pointRadius The radius of
     * @return {Object} The bounds of the calculated rectangle
     */
    var boundingRectangle = function(points, areaWidth, areaHeight, pointRadius) {
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
     * @method bytesToSize
     * @param {Number} bytes
     * @returns {String}
     */
    var bytesToSize = function(bytes) {
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0)
            return '';
        var value = parseFloat(Math.floor(Math.log(bytes) / Math.log(1024)));
        return (bytes / Math.pow(1024, value)).toFixed(2) + ' ' + sizes[value];
    };
    /**
     * @property {Number} daysInSecond
     */
    var daysInSecond = 1 / 86400;
    /**
     * @method distance
     * @param {Point} point1
     * @param {Point} point2
     * @return {Number} The distance between the first and last points
     */
    var distance = function(point1, point2) {
        var xs = point2.x - point1.x;
        xs = xs * xs;
        var ys = point2.y - point1.y;
        ys = ys * ys;
        return Math.sqrt(xs + ys);
    };
    /**
     * @method guid
     * @returns {String}
     */
    function guid() {
        return Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1);
    };
    /**
     * Takes a the first character from a string and return whether it is a kana character.
     * 
     * NOTE: It's also currently checking for the unicode tilde because those need to be filtered
     * out of Japanese writings as well. For Chinese it's also filtering out periods, but I don't
     * think they are actually an issue when it comes to rune prompts.
     * 
     * @method isKana
     * @param {String} character
     * @returns {Boolean}
     */
    var isKana = function(character) {
        var charCode = character.charCodeAt(0);
        return (charCode >= 12353 && charCode <= 12436) || (charCode >= 12449 && charCode <= 12539) || charCode === 65374;
    };
    /**
     * Checks to see if one of the approved live server domains is being used or not.
     * 
     * @method isLocal
     * @param {String} hostname
     * @returns {Boolean}
     */
    var isLocal = function(hostname) {
        hostname = hostname ? hostname : document.location.hostname || window.location.hostname || location.hostname;
        if (hostname === 'html5.skritter.com' || hostname === 'html5.skritter.cn')
            return false;
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
     * @method getUnixTime
     * @param {Boolean} milliseconds
     * @returns {Number}
     */
    var getUnixTime = function(milliseconds) {
        var unixtime = new Date().getTime();
        return milliseconds ? unixtime : Math.round(unixtime / 1000);
    };
    /**
     * @method pad
     * @param {String} text The text requiring padding
     * @param {String} value The value to be applied as padding
     * @param {Number} size The number of spaces of padding to be applied
     * @return {String}
     */
    var pad = function(text, value, size) {
        value = '' + value;
        var string = text + '';
        while (string.length < size)
            string = value + '' + string;
        return string;
    };
    /**
     * @property {Object} params
     */
    var params = ParamMap;
    /**
     * @property {Object} pinyin
     */
    var pinyin = PinyinConverter;
    /**
     * @method randomNumber
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    /**
     * @property {Object} recognizer
     */
    var recognizer = new Recognizer();
    /**
     * @property {Object} Scheduler
     */
    var scheduler = Scheduler;
    /**
     * @property {Object} shortstraw
     */
    var shortstraw = new Shortstraw();
    /**
     * @property {Object} simptrad
     */
    var simptrad = SimpTradMap;
    /**
     * @property {Object} strokes
     */
    var strokes = StrokeMap;
    
    return {
        angle: angle,
        arrayToInt: arrayToInt,
        bootstrap: bootstrap,
        boundingRectangle: boundingRectangle,
        bytesToSize: bytesToSize,
        daysInSecond: daysInSecond,
        distance: distance,
        getUnixTime: getUnixTime,
        guid: guid,
        isKana: isKana,
        isLocal: isLocal,
        isNumber: isNumber,
        pad: pad,
        params: params,
        pinyin: pinyin,
        randomNumber: randomNumber,
        recognizer: recognizer,
        scheduler: scheduler,
        shortstraw: shortstraw,
        simptrad: simptrad,
        strokes: strokes
    };
});
