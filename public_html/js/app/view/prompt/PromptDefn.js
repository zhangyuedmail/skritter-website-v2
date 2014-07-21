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
         * @returns {PromptRdng}
         */
        renderFields: function() {
            Prompt.prototype.renderFields.call(this);
            if (this.vocab.has('audio')) {
                this.elements.buttonAudio.show();
            } else {
                this.elements.buttonAudio.hide();
            }
            this.elements.buttonEraser.hide();
            this.elements.buttonReveal.hide();
            this.elements.promptAnswerText.html(this.vocab.getDefinition());
            this.elements.promptQuestion.show();
            this.elements.promptQuestionHelp.text("(tap to reveal)");
            this.elements.promptQuestionText.text("What's the definition?");
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
            this.gradingButtons.show().select(3);
            return this;
        }
    });

    return PromptDefn;
});