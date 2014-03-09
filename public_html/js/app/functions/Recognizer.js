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
        var results = this.analyze(userStroke, character);
        return results[0];
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
                    if (this.checkDistance(userStroke, stroke)) {
                        userStroke.set({
                            bitmapId: stroke.get('bitmapId'),
                            data: stroke.get('data'),
                            shape: stroke.get('shape')
                        });
                        results.push(userStroke);
                    }
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