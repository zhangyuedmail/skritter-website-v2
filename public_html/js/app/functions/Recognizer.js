/**
 * @module Skritter
 * @submodule Functions
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class Recognizer
     */
    function Recognizer() {
        this.angleThreshold = 60;
        this.cornersPenalty = 100;
        this.cornersThreshold = 2;
        this.distanceThreshold = 200;
        this.cornersLengthThreshold = 200;
    }
    /**
     * @method recognize
     * @param {Backbone.Model} userStroke
     * @param {Backbone.Collection} character
     * @returns {Backbone.Model}
     */
    Recognizer.prototype.recognize = function(userStroke, character) {
        var results = this.analyze(userStroke, character);
        results = _.filter(results, 'total');
        results = _.sortBy(results, 'total');
        if (results.length > 0 && !character.contains(results[0]))
            return results[0];
        return false;
    };
    /**
     * @method analyze
     * @param {Backbone.Model} userStroke
     * @param {Backbone.Collection} character
     * @returns {Array}
     */
    Recognizer.prototype.analyze = function(userStroke, character) {
        var results = [];
        var size = skritter.settings.canvasSize();
        for (var a = 0, lengthA = character.targets.length; a < lengthA; a++) {
            var target = character.targets[a];
            for (var b = 0, lengthB = target.length; b < lengthB; b++) {
                var stroke = target.at(b);
                if (stroke.get('position') === character.position()) {
                    var bitmapId = stroke.get('bitmapId');
                    var contains = stroke.get('contains');
                    var data = stroke.get('data');
                    var id = stroke.id;
                    var params = stroke.inflateParams();
                    var position = stroke.get('position');
                    var shape = stroke.get('shape');
                    var tone = stroke.get('tone');
                    for (var c = 0, lengthC = params.length; c < lengthC; c++) {
                        var param = params[c];
                        var result = userStroke.clone();
                        var scores = {
                            angle: this.checkAngle(result, param),
                            corners: this.checkCorners(result, param),
                            cornersLength: this.checkCornersLength(result, param, size),
                            distance: this.checkDistance(result, param, size)
                        };
                        var total = 0;
                        for (var category in scores) {
                            var score = scores[category];
                            if (score < 0) {
                                total = false;
                                break;
                            }
                            total += score;    
                        }
                        result.set({
                            bitmapId: bitmapId,
                            contains: contains,
                            data: data,
                            id: id,
                            param: param,
                            position: position,
                            scores: scores,
                            shape: shape,
                            tone: tone
                        });
                        result.total = total;
                        results.push(result);
                    }
                }
            }
        }
        return results;
    };
    /**
     * @method checkAngle
     * @param {Backbone.Model} stroke
     * @param {Backbone.Model} target
     * @returns {Number}
     */
    Recognizer.prototype.checkAngle = function(stroke, target) {
        var score = Math.abs(stroke.angle() - target.angle());
        if (score <= this.angleThreshold)
            return score;
        return -1;

    };
    /**
     * @method checkCorners
     * @param {Backbone.Model} stroke
     * @param {Backbone.Model} target
     * @returns {Number}
     */
    Recognizer.prototype.checkCorners = function(stroke, target) {
        var score = Math.abs(stroke.get('corners').length - target.get('corners').length);
        if (score <= this.cornersThreshold)
            return score === 0 ? score : score * this.cornersPenalty;
        return -1;

    };
    /**
     * @method checkDistance
     * @param {Backbone.Model} stroke
     * @param {Backbone.Model} target
     * @param {Number} size
     * @returns {Number}
     */
    Recognizer.prototype.checkDistance = function(stroke, target, size) {
        var score = skritter.fn.distance(stroke.rectangle().c, target.rectangle().c);
        if (score < this.distanceThreshold * (size / skritter.settings.get('maxCanvasSize')))
            return score;
        return -1;

    };
    /**
     * @method checkCornersLength
     * @param {Backbone.Model} stroke
     * @param {Backbone.Model} target
     * @param {Number} size
     * @returns {Number}
     */
    Recognizer.prototype.checkCornersLength = function(stroke, target, size) {
        var score = Math.abs(stroke.cornersLength() - target.cornersLength());
        if (score < this.cornersLengthThreshold * (size / skritter.settings.get('maxCanvasSize')))
            return score;
        return -1;

    };

    return Recognizer;
});