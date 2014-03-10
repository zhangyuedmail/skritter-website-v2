/**
 * @module Skritter
 * @submodule Collections
 * @param Stroke
 * @author Joshua McFarland
 */
define([
    'models/prompts/Stroke'
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
            var newContained = stroke.containedIds();
            for (var a = 0, lengthA = this.length; a < lengthA; a++) {
                var id = this.at(a).id;
                var contains = this.at(a).containedIds();
                if (newId === id)
                    return true;
                for (var b = 0, lengthB = contains.length; b < lengthB; b++)
                    if (newContained.indexOf(contains[b]) !== -1)
                        return true;
            }
            return false;
        },
        /**
         * @method isFinished
         * @returns {Boolean}
         */
        isFinished: function() {
            if (this.position() >= this.max())
                return true;
            return false;
        },
        /**
         * @method position
         * @returns {Number}
         */
        position: function() {
            var position = 1;
            for (var i = 0, length = this.length; i < length; i++)
                position += this.at(i).has('contains') ? 2 : 1;
            return position;
        },
        /**
         * @method max
         * @returns {Number}
         */
        max: function() {
            var max = 0;
            for (var i = 0, length = this.targets.length; i < length; i++) {
                var targetMax = this.targets[i].position();
                max = targetMax > max ? targetMax : max;
            }
            return max;
        },
        /**
         * @method recognize
         * @param {Array} points
         * @returns {Backbone.Model}
         */
        recognize: function(points) {
            var stroke = new Stroke().set('points', points);
            return this.add(skritter.fn.recognizer.recognize(stroke, this));
        },
        /**
         * @method shape
         * @param {Number} size
         * @param {Number} excludeStrokePosition
         * @param {String} color
         * @returns {CreateJS.Container}
         */
        shape: function(size, excludeStrokePosition, color) {
            color = (color) ? color : '#000000';
            var shapeContainer = new createjs.Container();
            shapeContainer.name = 'character';
            for (var i = 0, length = this.models.length; i < length; i++)
                if (i !== excludeStrokePosition - 1)
                    shapeContainer.addChild(this.models[i].inflatedShape(size, color));
            return shapeContainer;
        }
    });

    return Character;
});