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
            this.container.$('.info-section .prompt-writing').html(this.vocab.getWriting());
            this.container.$('.info-section .prompt-reading').html(this.vocab.getReading(
                this.review.getPosition(),
                !skritter.user.settings.get('hideReading'),
                skritter.user.isUsingZhuyin()
            ));
            return this;
        },
        /**
         * @method handleClickCanvas
         * @param {Object} event
         */
        handleClickCanvas: function(event) {
            if (this.review.getContained().finished) {
                this.next();
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
            var possibleTones = _.flatten(this.review.getBaseVocab().getTones(this.review.getPosition()));
            if (points && points.length > 2) {
                this.canvas.lastMouseDownEvent = null;
                var result = this.review.getCharacter().recognize(points, shape);
                if (result) {
                    if (possibleTones.indexOf(result.get('tone')) > -1) {
                        this.review.setContained('score', 3);
                        this.canvas.tweenShape('stroke', result.getUserShape(), result.inflateShape(), _.bind(this.showAnswer, this));
                        this.canvas.injectLayer('stroke', skritter.settings.get('gradingColors')[this.review.getScore()]);
                    } else {
                        this.review.setContained('score', 1);
                        this.review.getCharacter().reset();
                        this.review.getCharacter().add(this.review.getCharacter().targets[possibleTones[0] - 1].models);
                        this.canvas.drawShape('stroke', this.review.getCharacter().getShape(), null, null);
                        this.canvas.injectLayer('stroke', skritter.settings.get('gradingColors')[this.review.getScore()]);
                        this.showAnswer();
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
                this.canvas.injectLayer('stroke', skritter.settings.get('gradingColors')[this.review.getScore()]);
                this.showAnswer();
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
            this.canvas.drawCharacterFromFont('background', this.vocab.getCharacters()[this.review.getPosition() - 1], this.vocab.getFontName());
        },
        /**
         * @method show
         * @returns {PromptTone}
         */
        show: function() {
            Prompt.prototype.show.call(this);
            this.canvas.show().disableGrid().enableInput();
            this.renderFields();
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
            this.review.setContained({
                finished: true
            });
            this.container.$('.info-section .prompt-reading').html(this.vocab.getReading(
                this.review.getPosition() + 1,
                !skritter.user.settings.get('hideReading'),
                skritter.user.isUsingZhuyin()
            ));
            this.gradingButtons.show().select(this.review.getScore());
            return this;
        }
    });

    return PromptTone;
});