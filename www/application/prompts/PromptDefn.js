/**
 * @module Application
 */
define([
    'prompts/Prompt',
    'require.text!templates/desktop/prompts/prompt-defn.html'
], function(Prompt, DesktopTemplate) {
    /**
     * @class PromptDefn
     * @extends {Prompt}
     */
    var PromptDefn = Prompt.extend({
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
         * @returns {PromptDefn}
         */
        render: function() {
            Prompt.prototype.render.call(this);
            this.$el.html(this.compile(DesktopTemplate));
            this.elements.fieldAnswer = this.$('.field-answer');
            this.elements.fieldQuestion = this.$('.field-question');
            this.elements.fieldWriting = this.$('.field-writing');
            if (this.review.isAnswered()) {
                this.renderAnswer();
            } else {
                this.renderQuestion();
            }
            return this;
        },
        /**
         * @method renderAnswer
         * @returns {PromptDefn}
         */
        renderAnswer: function() {
            this.review.setAt('newInterval', 1000);
            this.elements.fieldAnswer.text(this.review.get('vocab').getDefinition());
            this.elements.fieldQuestion.hide();
            return this;
        },
        /**
         * @method renderQuestion
         * @returns {PromptDefn}
         */
        renderQuestion: function() {
            this.elements.fieldWriting.text(this.review.get('vocab').get('writing'));
            this.elements.fieldQuestion.text(app.strings.prompt['definition-question']);
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

    return PromptDefn;
});
