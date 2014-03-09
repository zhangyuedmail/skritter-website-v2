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
        this.distanceThreshold = 200;
    }
    /**
     * @method recognize
     * @param {Backbone.Model} userStroke
     * @param {Backbone.Collection} character
     * @returns {Backbone.Model}
     */
    Recognizer.prototype.recognize = function(userStroke, character) {
        this.analyze(userStroke, character);
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
                    this.checkDistance(userStroke, stroke);
                    return userStroke;
                }
            }
        }
        return results;
    };
    
    Recognizer.prototype.checkDistance = function(stroke, target) {
        var score = skritter.fn.distance(stroke.rectangle().c, target.inflateParams()[0].rectangle().c);
        if (score < this.distanceThreshold)
            return score;
        return false;
        
    };
    
    return Recognizer;
});