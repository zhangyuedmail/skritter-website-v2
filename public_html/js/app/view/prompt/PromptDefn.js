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
            this.container.$('.input-section .prompt-writing').html(this.vocab.getWriting());
            this.container.$('.input-section .prompt-answer-text').html(this.vocab.getDefinition());
            this.container.$('.input-section .prompt-question-text').text("What's the definition?");
            this.container.$('.input-section .prompt-question-help').text("(tap to reveal)");
            this.container.$('.input-section .prompt-question').show();
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
            Prompt.prototype.show.call(this);
            this.canvas.show().disableGrid();
            this.renderFields();
            return this;
        },
        /**
         * @method showAnswer
         * @returns {PromptDefn}
         */
        showAnswer: function() {
            Prompt.prototype.showAnswer.call(this);
            this.container.$('.input-section .prompt-question').hide();
            this.container.$('.input-section .prompt-answer').show();
            this.gradingButtons.show().select(3);
            return this;
        }
    });

    return PromptDefn;
});