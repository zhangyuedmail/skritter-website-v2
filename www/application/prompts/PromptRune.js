/**
 * @module Application
 */
define([
    'prompts/Prompt',
    'require.text!templates/desktop/prompts/prompt-rune.html'
], function(Prompt, DesktopTemplate) {
    /**
     * @class PromptRune
     * @extends {Prompt}
     */
    var PromptRune = Prompt.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @param {PromptController} controller
         * @param {DataReview} review
         * @constructor
         */
        initialize: function(options, controller, review) {
            Prompt.prototype.initialize.call(this, options, controller, review);
        },
        /**
         * @method render
         * @returns {PromptRune}
         */
        render: function() {
            Prompt.prototype.render.call(this);
            this.$el.html(this.compile(DesktopTemplate));
            this.elements.fieldWriting = this.$('.field-writing');
            this.canvas.showGrid().show();
            if (this.review.isAnswered()) {
                this.renderAnswer();
            } else {
                this.renderQuestion();
            }
            return this;
        },
        /**
         * @method renderElements
         * @returns {PromptRune}
         */
        renderElements: function() {
            return this;
        },
        /**
         * @method renderAnswer
         * @returns {PromptRune}
         */
        renderAnswer: function() {
            this.review.setAt('newInterval', 1000);
            return this;
        },
        /**
         * @method renderQuestion
         * @returns {PromptRune}
         */
        renderQuestion: function() {
            this.elements.fieldWriting.text(this.review.get('vocab').get('writing'));
            return this;
        },
        /**
         * @method handlePromptClicked
         * @param {Event} event
         */
        handlePromptClicked: function(event) {
            event.preventDefault();
            if (this.review.isAnswered()) {
                this.next();
            } else {
                this.renderAnswer();
            }
        }
    });

    return PromptRune;
});
