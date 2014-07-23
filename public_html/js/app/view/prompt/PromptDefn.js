define([
    'view/prompt/Prompt'
], function(Prompt) {
    /**
     * @class PromptDefn
     */
    var PromptDefn = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function(container) {
            Prompt.prototype.initialize.call(this, container);
        },
        /**
         * @method renderFields
         * @returns {PromptDefn}
         */
        renderFields: function() {
            if (this.vocab.has('audio')) {
                this.elements.buttonAudio.show();
            } else {
                this.elements.buttonAudio.hide();
            }
            this.elements.buttonEraser.hide();
            this.elements.buttonHint.show();
            this.elements.buttonReveal.hide();
            this.elements.promptAnswerText.html(this.vocab.getDefinition());
            this.elements.promptQuestion.show();
            this.elements.promptQuestionHelp.text("(tap to reveal)");
            this.elements.promptQuestionText.text("What's the definition?");
            this.elements.promptQuestionTitle.html(this.vocab.getWriting());
            this.elements.promptReading.hide().html(this.vocab.getReading());
            this.elements.promptSentence.hide().text(this.vocab.getSentence() ? this.vocab.getSentence() : undefined);

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
         * @returns {PromptDefn}
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
            this.canvas.resize();
        },
        /**
         * @method show
         * @returns {PromptDefn}
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
         * @returns {PromptDefn}
         */
        showAnswer: function() {
            Prompt.prototype.showAnswer.call(this);
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
            this.elements.promptReading.show();
            this.elements.promptSentence.show();
        }
    });

    return PromptDefn;
});