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
        this.cornersThreshold = 2;
        this.distanceThreshold = 200;
    }
    /**
     * @method recognize
     * @param {Backbone.Model} userStroke
     * @param {Backbone.Collection} character
     * @returns {Backbone.Model}
     */
    Recognizer.prototype.recognize = function(userStroke, character) {
        var results = this.analyze(userStroke, character);
        console.log(results);
        results = _.filter(results, 'total');
        results = _.sortBy(results, 'total');
        if (results.length > 0)
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
        for (var a = 0, lengthA = character.targets.length; a < lengthA; a++) {
            var target = character.targets[a];
            for (var b = 0, lengthB = target.length; b < lengthB; b++) {
                var stroke = target.at(b);
                if (stroke.get('position') === character.position()) {
                    var bitmapId = stroke.get('bitmapId');
                    var data = stroke.get('data');
                    var params = stroke.inflateParams();
                    var shape = stroke.get('shape');
                    for (var c = 0, lengthC = params.length; c < lengthC; c++) {
                        var param = params[c];
                        var result = userStroke.clone();
                        var scores = {
                            corners: this.checkCorners(result, param),
                            distance: this.checkDistance(result, param)
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
                            data: data,
                            param: param,
                            scores: scores,
                            shape: shape
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
     * @method checkCorners
     * @param {Backbone.Model} stroke
     * @param {Backbone.Model} target
     * @returns {Number}
     */
    Recognizer.prototype.checkCorners = function(stroke, target) {
        var score = Math.abs(stroke.get('corners').length - target.get('corners').length);
        if (score <= this.cornersThreshold)
            return score === 0 ? score : score * 50;
        return -1;

    };
    /**
     * @method checkDistance
     * @param {Backbone.Model} stroke
     * @param {Backbone.Model} target
     * @returns {Number}
     */
    Recognizer.prototype.checkDistance = function(stroke, target) {
        var score = skritter.fn.distance(stroke.rectangle().c, target.rectangle().c);
        if (score < this.distanceThreshold)
            return score;
        return -1;

    };

    return Recognizer;
});