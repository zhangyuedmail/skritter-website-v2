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
         * @method renderFields
         * @param {PromptRune}
         */
        renderFields: function() {
            Prompt.prototype.renderFields.call(this);
            this.elements.buttonEraser.show();
            this.elements.buttonReveal.show();
            this.elements.promptDefinition.html(this.vocab.getDefinition());
            this.elements.promptReading.html(this.vocab.getReading());
            this.elements.promptWriting.html(this.vocab.getWriting(this.review.getPosition()));
            return this;
        },
        /**
         * @method eraseCharacter
         */
        eraseCharacter: function() {
            this.gradingButtons.hide();
            this.teachingButtons.hide();
            this.review.getCharacter().reset();
            this.canvas.clear().enableInput();
        },
        /**
         * @method handleClickCanvas
         * @param {Object} event
         */
        handleClickCanvas: function(event) {
            if (this.review.isFinished()) {
                this.next();
            }
            event.preventDefault();
        },
        /**
         * @method handleInputDown
         * @param {Object} event
         */
        handleInputDown: function(event) {
            this.canvas.fadeLayer('background');
            skritter.timer.stopThinking();
            event.preventDefault();
        },
        /**
         * @method handleClickEraser
         * @param event
         */
        handleClickEraser: function(event) {
            this.eraseCharacter();
            event.preventDefault();
        },
        /**
         * @method handleGradingSelected
         * @param {Object} event
         */
        handleGradingSelected: function(event, score) {
            this.review.setContained('score', score);
            if (skritter.user.isUsingSquigs()) {
                this.canvas.injectLayerColor('background', skritter.settings.get('gradingColors')[this.review.getScore()]);
            } else {
                this.canvas.injectLayerColor('stroke', skritter.settings.get('gradingColors')[this.review.getScore()]);
            }
            event.preventDefault();
        },
        /**
         * @method handleInputUp
         * @param {Object} event
         * @param {Array} points
         * @param {createjs.Shape} shape
         */
        handleInputUp: function(event, points, shape) {
            if (points && points.length > 2) {
                this.canvas.lastMouseDownEvent = null;
                var result = this.review.getCharacter().recognize(points, shape);
                if (result) {
                    if (this.review.getCharacter().isFinished()) {
                        this.showAnswer();
                    }
                    if (skritter.user.isUsingSquigs()) {
                        this.canvas.drawShape('stroke', shape);
                        this.canvas.getLayer('stroke').alpha = 1;
                        if (this.review.getCharacter().isFinished()) {
                            this.canvas.tweenCharacter('background', this.review.getCharacter(), _.bind(function() {
                                this.canvas.disableTicker();
                            }, this));
                            this.canvas.injectLayerColor('background', skritter.settings.get('gradingColors')[this.review.getScore()]);
                            this.canvas.getLayer('stroke').alpha = 0.6;
                        }
                    } else {
                        this.canvas.tweenShape('stroke', result.getUserShape(), result.inflateShape(), _.bind(function() {
                            if (this.review.getCharacter().isFinished()) {
                                this.canvas.disableTicker();
                            }
                        }, this));
                        if (this.review.getCharacter().isFinished()) {
                            this.canvas.injectLayerColor('stroke', skritter.settings.get('gradingColors')[this.review.getScore()]);
                        }
                    }
                } else {
                    this.strokeAttempts++;
                    this.canvas.fadeShape('background', shape);
                    if (this.strokeAttempts > this.maxStrokeAttempts) {
                        this.review.setContained('score', 1);
                    }
                }
            }
            event.preventDefault();
        },
        /**
         * @method handleClickReveal
         * @param event
         */
        handleClickReveal: function(event) {
            this.revealCharacter();
            event.preventDefault();
        },
        /**
         * @method hide
         */
        hide: function() {
            Prompt.prototype.hide.call(this);
        },
        /**
         * @method reset
         * @returns {PromptRune}
         */
        reset: function() {
            Prompt.prototype.reset.call(this);
            this.canvas.clear();
            return this;
        },
        /**
         * @method resize
         */
        resize: function() {
            Prompt.prototype.resize.call(this);
            this.canvas.clear().resize();
            if (this.review.getCharacter().length) {
                this.canvas.drawShape('stroke', this.review.getCharacter().getShape());
            } else if (this.review.isFinished()) {
                this.canvas.drawCharacterFromFont('stroke',
                    this.vocab.getCharacters()[this.review.getPosition() - 1],
                    this.vocab.getFontName(), skritter.settings.get('gradingColors')[this.review.getScore()]
                );
            }
        },
        /**
         * @method revealCharacter
         * @param {Number} excludeStroke
         */
        revealCharacter: function(excludeStroke) {
            this.canvas.clearLayer('background');
            this.canvas.drawShape('background', this.review.getCharacter().targets[0].getShape(excludeStroke), '#999999');
        },
        /**
         * @method show
         * @returns {PromptRune}
         */
        show: function() {
            skritter.timer.setLimit(30, 15);
            Prompt.prototype.show.call(this);
            this.canvas.show().enableTicker().enableGrid().enableInput();
            this.renderFields();
            if (this.review.isFinished()) {
                this.showAnswer();
            }
            this.resize();
            return this;
        },
        /**
         * @method showAnswer
         * @returns {PromptRune}
         */
        showAnswer: function() {
            Prompt.prototype.showAnswer.call(this);
            this.canvas.disableInput();
            this.container.$('.info-section .button-reveal').hide();
            this.container.$('.info-section .prompt-writing').html(this.vocab.getWriting(this.review.getPosition() + 1));
            this.gradingButtons.show().select(this.review.getScore());
            return this;
        }
    });

    return PromptRune;
});