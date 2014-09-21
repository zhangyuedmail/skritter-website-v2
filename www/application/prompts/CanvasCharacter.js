/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'prompts/CanvasStroke'
], function(BaseCollection, CanvasStroke) {
    /**
     * @class CanvasCharacter
     * @extend BaseCollection
     */
    var CanvasCharacter = BaseCollection.extend({
        /**
         * @property model
         * @type CanvasStroke
         */
        model: CanvasStroke,
        /**
         * @method comparator
         * @param {CanvasStroke} stroke
         * @returns {Number}
         */
        comparator: function(stroke) {
            return stroke.attributes.position;
        },
        /**
         * @method contains
         * @param {CanvasStroke} stroke
         * @returns {Boolean}
         */
        contains: function(stroke) {
            var newId = stroke.id;
            var newContained = stroke.getContainedIds();
            for (var a = 0, lengthA = this.length; a < lengthA; a++) {
                var id = this.at(a).id;
                var contains = this.at(a).getContainedIds();
                if (newId === id) {
                    return true;
                }
                for (var b = 0, lengthB = contains.length; b < lengthB; b++) {
                    if (newContained.indexOf(contains[b]) !== -1) {
                        return true;
                    }
                }
            }
            return false;
        },
        /**
         * @method expectedStroke
         * @returns {CanvasStroke}
         */
        getExpectedStroke: function() {
            var variation = this.getExpectedVariations()[0];
            if (this.length === 0) {
                return variation.at(0);
            }
            return variation.at(this.length);
        },
        /**
         * @method expectedVariations
         * @returns {Array}
         */
        getExpectedVariations: function() {
            var expectedTargets = [];
            var targetScores = [];
            for (var a = 0, lengthA = this.targets.length; a < lengthA; a++) {
                targetScores[a] = 0;
                var target = this.targets[a];
                for (var b = 0, lengthB = this.length; b < lengthB; b++) {
                    var strokeId = this.at(b).id;
                    if (target.findWhere({id: strokeId})) {
                        targetScores[a]++;
                    }
                }
            }
            var targetScore = targetScores[targetScores.indexOf(Math.max.apply(Math, targetScores))];
            for (var i = 0, length = targetScores.length; i < length; i++) {
                if (targetScores[i] === targetScore) {
                    expectedTargets.push(this.targets[i]);
                }
            }
            return expectedTargets;
        },
        /**
         * @method getPosition
         * @returns {Number}
         */
        getPosition: function() {
            var position = 1;
            for (var i = 0, length = this.length; i < length; i++) {
                position += this.at(i).has('contains') ? 2 : 1;
            }
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
        }
    });

    return CanvasCharacter;
});
