define([
    'view/prompt/Prompt'
], function(Prompt) {
    /**
     * @class PromptRdng
     */
    var PromptRdng = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function(container) {
            Prompt.prototype.initialize.call(this, container);
        },
        /**
         * @method renderFields
         * @returns {PromptRdng}
         */
        renderFields: function() {
            Prompt.prototype.renderFields.call(this);
            this.elements.buttonAudio.hide();
            this.elements.buttonEraser.hide();
            this.elements.buttonReveal.hide();
            this.elements.promptAnswerText.html(this.vocab.getReading());
            this.elements.promptDefinition.hide().html(this.vocab.getDefinition());
            this.elements.promptQuestion.show();
            this.elements.promptQuestionHelp.text("(tap to reveal)");
            this.elements.promptQuestionText.text("What's the reading?");
            this.elements.promptQuestionTitle.html(this.vocab.getWriting());
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
         * @method handleClickHint
         * @param {Object} event
         */
        handleClickHint: function(event) {
            this.showHint();
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
         * @returns {PromptRdng}
         */
        reset: function() {
            Prompt.prototype.reset.call(this);
            return this;
        },
        /**
         * @method resize
         */
        resize: function() {
            Prompt.prototype.resize.call(this);
        },
        /**
         * @method show
         * @returns {PromptRdng}
         */
        show: function() {
            skritter.timer.setLimit(30, 15);
            this.canvas.show().disableGrid();
            this.renderFields();
            Prompt.prototype.show.call(this);
            this.resize();
            return this;
        },
        /**
         * @method showAnswer
         * @returns {PromptRdng}
         */
        showAnswer: function() {
            Prompt.prototype.showAnswer.call(this);
            if (this.vocab.has('audio')) {
                this.elements.buttonAudio.show();
            }
            this.elements.promptAnswer.show();
            this.elements.promptQuestion.hide();
            this.showHint();
            this.gradingButtons.show().select(3);
            if (skritter.user.isAudioEnabled()) {
                this.vocab.playAudio();
            }
            return this;
        },
        /**
         * @method showHint
         */
        showHint: function() {
            this.elements.buttonHint.hide();
            this.elements.promptDefinition.show();
            this.elements.promptSentence.show();
        }
    });

    return PromptRdng;
});