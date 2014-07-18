define([
    'view/prompt/Prompt'
], function(Prompt) {
    /**
     * @class PromptTone
     */
    var PromptTone = Prompt.extend({
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
         * @param {PromptTone}
         */
        renderFields: function() {
            Prompt.prototype.renderFields.call(this);
            this.elements.buttonEraser.hide();
            this.elements.buttonReveal.hide();
            this.elements.promptDefinition.html(this.vocab.getDefinition());
            if (skritter.user.settings.get('hideReading')) {
                this.elements.promptReading.html(this.vocab.getReading(this.review.getPosition(), true, true, skritter.user.isUsingZhuyin()));
            } else {
                this.elements.promptReading.html(this.vocab.getReading(this.review.getPosition(), true, false, skritter.user.isUsingZhuyin()));
            }
            this.elements.promptWriting.html(this.vocab.getWriting());
            return this;
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
         * @method handleGradingSelected
         * @param {Object} event
         */
        handleGradingSelected: function(event, score) {
            this.review.setContained('score', score);
            this.canvas.injectLayerColor('stroke', skritter.settings.get('gradingColors')[this.review.getScore()]);
            event.preventDefault();
        },
        /**
         * @method handleInputDown
         * @param {Object} event
         */
        handleInputDown: function(event) {
            if (skritter.timer.isThinking()) {
                skritter.timer.stopThinking();
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
            var possibleTones = _.flatten(this.review.getBaseVocab().getTones(this.review.getPosition()));
            if (points && skritter.fn.getDistanceFromArray(points) > 20) {
                this.canvas.lastMouseDownEvent = null;
                var result = this.review.getCharacter().recognize(points, shape);
                if (result) {
                    if (possibleTones.indexOf(result.get('tone')) > -1) {
                        this.review.setContained('score', 3);
                        this.canvas.tweenShape('stroke', result.getUserShape(), result.inflateShape(), _.bind(function() {
                            this.canvas.disableTicker();
                        }, this));
                        this.canvas.injectLayerColor('stroke', skritter.settings.get('gradingColors')[this.review.getScore()]);
                    } else {
                        this.review.setContained('score', 1);
                        this.review.getCharacter().reset();
                        this.review.getCharacter().add(this.review.getCharacter().targets[possibleTones[0] - 1].models);
                        this.canvas.drawShape('stroke', this.review.getCharacter().getShape(), null, null);
                        this.canvas.injectLayerColor('stroke', skritter.settings.get('gradingColors')[this.review.getScore()]);
                    }
                }
            } else {
                if (possibleTones.indexOf(5) > -1) {
                    this.review.setContained('score', 3);
                    this.review.getCharacter().add(this.review.getCharacter().targets[4].models);
                    this.canvas.drawShape('stroke', this.review.getCharacter().getShape(), null, null);
                } else {
                    this.review.setContained('score', 1);
                    this.review.getCharacter().add(this.review.getCharacter().targets[possibleTones[0] - 1].models);
                    this.canvas.drawShape('stroke', this.review.getCharacter().getShape(), null, null);
                }
                this.canvas.injectLayerColor('stroke', skritter.settings.get('gradingColors')[this.review.getScore()]);
            }
            this.showAnswer();
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
         * @returns {PromptTone}
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
            this.canvas.drawCharacterFromFont('background', this.vocab.getCharacters()[this.review.getPosition() - 1], this.vocab.getFontName());
            if (this.review.getCharacter().length) {
                this.canvas.drawShape('stroke', this.review.getCharacter().getShape());
            } else if (this.review.isFinished()) {
                //TODO: save selected correct tone with review data
                var possibleTones = _.flatten(this.review.getBaseVocab().getTones(this.review.getPosition()));
                this.review.getCharacter().add(this.review.getCharacter().targets[possibleTones[0] - 1].models);
                this.canvas.drawShape('stroke', this.review.getCharacter().getShape(), null, null);
                this.canvas.injectLayerColor('stroke', skritter.settings.get('gradingColors')[this.review.getScore()]);
            }
        },
        /**
         * @method show
         * @returns {PromptTone}
         */
        show: function() {
            skritter.timer.setLimit(15, 10);
            this.canvas.show().enableTicker().disableGrid().enableInput();
            this.renderFields();
            Prompt.prototype.show.call(this);
            this.resize();
            return this;
        },
        /**
         * @method showAnswer
         * @returns {PromptTone}
         */
        showAnswer: function() {
            Prompt.prototype.showAnswer.call(this);
            this.canvas.disableInput();
            if (skritter.user.settings.get('hideReading')) {
                this.elements.promptReading.html(this.vocab.getReading(this.review.getPosition() + 1, true, true, skritter.user.isUsingZhuyin()));
            } else {
                this.elements.promptReading.html(this.vocab.getReading(this.review.getPosition() + 1, true, false, skritter.user.isUsingZhuyin()));
            }
            this.gradingButtons.show().select(this.review.getScore());
            return this;
        }
    });

    return PromptTone;
});