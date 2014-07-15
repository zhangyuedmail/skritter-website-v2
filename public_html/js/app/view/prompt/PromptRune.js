define([
    'view/prompt/Prompt'
], function(Prompt) {
    /**
     * @class PromptRune
     */
    var PromptRune = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function(container) {
            Prompt.prototype.initialize.call(this, container);
            this.maxStrokeAttempts = 3;
            this.strokeAttempts = 0;
        },
        /**
         * @method clear
         * @param {PromptRune}
         */
        clear: function() {
            Prompt.prototype.clear.call(this);
            this.canvas.clear();
            return this;
        },
        /**
         * @method handleClickCanvas
         * @param {Object} event
         */
        handleClickCanvas: function(event) {
            if (this.review.getContained().finished) {
                this.next();
            } else {
                this.showAnswer();
            }
            event.preventDefault();
        },
        /**
         * @method handleInputDown
         * @param {Object} event
         */
        handleInputDown: function(event) {
            skritter.timer.stopThinking();
            event.preventDefault();
        },
        /**
         * @method handleInputUp
         * @param {Object} event
         * @param {Array} points
         * @param {createjs.Shape} shape
         */
        handleInputUp: function(event, points, shape) {
            if (points && points.length > 5) {
                var result = this.review.getCharacter().recognize(points, shape);
                if (result) {
                    this.canvas.lastMouseDownEvent = null;
                    this.canvas.tweenShape('stroke', result.getUserShape(), result.inflateShape());
                } else {
                    this.strokeAttempts++;
                    this.canvas.fadeShape('background', shape);
                    if (this.strokeAttempts > this.maxStrokeAttempts) {
                        this.review.setContained('score', 1);
                    }
                }
                if (this.review.getCharacter().isFinished()) {
                    this.showAnswer();
                }
            } else {
                this.canvas.fadeShape('background', shape);
            }
            event.preventDefault();
        },
        /**
         * @method hide
         */
        hide: function() {
            Prompt.prototype.hide.call(this);
        },
        /**
         * @method show
         * @returns {PromptRune}
         */
        show: function() {
            Prompt.prototype.show.call(this);
            this.canvas.show().enableGrid().enableInput();
            this.container.$('.info-section .prompt-writing').html(this.vocab.getWriting(this.review.getPosition()));
            this.container.$('.info-section .prompt-reading').html(this.vocab.getReading());
            return this;
        },
        /**
         * @method showAnswer
         * @returns {PromptRune}
         */
        showAnswer: function() {
            Prompt.prototype.showAnswer.call(this);
            this.review.setContained({
                finished: true
            });
            return this;
        }
    });

    return PromptRune;
});