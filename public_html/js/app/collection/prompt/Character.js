/**
 * @module Skritter
 * @submodule Collection
 * @param Stroke
 * @author Joshua McFarland
 */
define([
    'model/prompt/Stroke'
], function(Stroke) {
    /**
     * @class PromptCharacter
     */
    var Character = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.targets = [];
        },
        /**
         * @property {CanvasStroke} model
         */
        model: Stroke,
        /**
         * @method comparator
         * @param {Backbone.Model} stroke
         * @returns {Number}
         */
        comparator: function(stroke) {
            return stroke.get('position');
        },
        /**
         * @method contains
         * @param {Backbone.Model} stroke
         * @returns {Boolean}
         */
        contains: function(stroke) {
            var newId = stroke.id;
            var newContained = stroke.getContainedIds();
            for (var a = 0, lengthA = this.length; a < lengthA; a++) {
                var id = this.at(a).id;
                var contains = this.at(a).getContainedIds();
                if (newId === id)
                    return true;
                for (var b = 0, lengthB = contains.length; b < lengthB; b++)
                    if (newContained.indexOf(contains[b]) !== -1)
                        return true;
            }
            return false;
        },
        /**
         * Returns the expected next stroke based on the predicted variation and current position
         * within the user character.
         * 
         * @method expectedStroke
         * @returns {Backbone.Model}
         */
        getExpectedStroke: function() {
            var variation = this.getExpectedVariation();
            if (this.length === 0)
                return variation.at(0);
            return variation.at(this.length);
        },
        /**
         * Returns the expected variation from the array possible targets.
         * 
         * @method expectedVariation
         * @returns {Backbone.Model}
         */
        getExpectedVariation: function() {
            if (this.targets.length <= 1)
                return this.targets[0];
            var targetScores = [];
            for (var i = 0, length = this.targets.length; i < length; i++)
                targetScores[i] = 0;
            for (var a = 0, lengthA = this.length; a < lengthA; a++) {
                var strokeId = this.at(a).id;
                for (var b = 0, lengthB = this.targets.length; b < lengthB; b++) {
                    var target = this.targets[b];
                    if (target.findWhere({id: strokeId}))
                        targetScores[b]++;
                }
            }
            return this.targets[targetScores.indexOf(Math.max.apply(Math, targetScores))];
        },
        /**
         * @method getPosition
         * @returns {Number}
         */
        getPosition: function() {
            var position = 1;
            for (var i = 0, length = this.length; i < length; i++)
                position += this.at(i).has('contains') ? 2 : 1;
            return position;
        },
        /**
         * @method getMax
         * @returns {Number}
         */
        getMax: function() {
            var max = 0;
            for (var i = 0, length = this.targets.length; i < length; i++) {
                var targetMax = this.targets[i].getPosition();
                max = targetMax > max ? targetMax : max;
            }
            return max;
        },
        /**
         * @method getShape
         * @param {Number} excludeStrokePosition
         * @param {String} color
         * @returns {CreateJS.Container}
         */
        getShape: function(excludeStrokePosition, color) {
            color = (color) ? color : '#000000';
            var shapeContainer = new createjs.Container();
            shapeContainer.name = 'character';
            for (var i = 0, length = this.models.length; i < length; i++)
                if (i !== excludeStrokePosition - 1)
                    shapeContainer.addChild(this.models[i].inflateShape(color));
            return shapeContainer;
        },
        /**
         * @method isFinished
         * @returns {Boolean}
         */
        isFinished: function() {
            if (this.getPosition() >= this.getMax())
                return true;
            return false;
        },
        /**
         * @method recognize
         * @param {Array} points
         * @returns {Backbone.Model}
         */
        recognize: function(points) {
            var stroke = new Stroke().set('points', points);
            return this.add(skritter.fn.recognizer.recognize(stroke, this));
        }
    });

    return Character;
});