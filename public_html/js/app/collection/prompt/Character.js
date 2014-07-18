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
         * @returns {Backbone.Model}
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
        },
        /**
         * @method getShape
         * @param {Number} excludeStrokePosition
         * @returns {createjs.Container}
         */
        getShape: function(excludeStrokePosition) {
            var shapeContainer = new createjs.Container();
            shapeContainer.name = 'character';
            for (var i = 0, length = this.models.length; i < length; i++) {
                if (i !== excludeStrokePosition - 1) {
                    shapeContainer.addChild(this.models[i].inflateShape());
                }
            }
            return shapeContainer;
        },
        /**
         * @method getSquig
         * @param {Number} excludeSquigPosition
         * @returns {createjs.Container}
         */
        getSquig: function(excludeSquigPosition) {
            var canvasSize = skritter.settings.getCanvasSize();
            var squigContainer = new createjs.Container();
            squigContainer.name = 'squig';
            for (var i = 0, length = this.models.length; i < length; i++) {
                if (i !== excludeSquigPosition - 1) {
                    var model = this.models[i];
                    var squig = model.get('squig').clone(true);
                    var squigSize = model.get('squigSize');
                    squig.scaleX = canvasSize / squigSize;
                    squig.scaleY = canvasSize / squigSize;
                    squigContainer.addChild(squig);
                }
            }
            return squigContainer;
        },
        /**
         * @method isFinished
         * @returns {Boolean}
         */
        isFinished: function() {
            if (this.getPosition() >= this.getMax()) {
                return true;
            }
            return false;
        },
        /**
         * @method recognize
         * @param {Array} points
         * @param {createjs.Shape} shape
         * @returns {Backbone.Model}
         */
        recognize: function(points, shape) {
            var stroke = new Stroke().set('points', points);
            stroke = skritter.fn.recognizer.recognize(stroke, this);
            if (stroke) {
                stroke.set('squig', shape);
                return this.add(stroke);
            } 
            return null;
        }
    });

    return Character;
});