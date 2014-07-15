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
         * @method show
         * @returns {PromptRdng}
         */
        show: function() {
            Prompt.prototype.show.call(this);
            this.canvas.show().disableGrid();
            this.container.$('.input-section .prompt-writing').html(this.vocab.getWriting());
            this.container.$('.input-section .prompt-answer-text').html(this.vocab.getReading());
            this.container.$('.input-section .prompt-question-text').text("What's the reading?");
            this.container.$('.input-section .prompt-question-help').text("(tap to reveal)");
            this.container.$('.input-section .prompt-question').show();
            return this;
        },
        /**
         * @method showAnswer
         * @returns {PromptRdng}
         */
        showAnswer: function() {
            Prompt.prototype.showAnswer.call(this);
            this.container.$('.input-section .prompt-question').hide();
            this.container.$('.input-section .prompt-answer').show();

            this.review.setContained({
                finished: true
            });

            return this;
        }
    });

    return PromptRdng;
});