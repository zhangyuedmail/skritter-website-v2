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
            this.$el.html(this.compile(DesktopTemplate));
            Prompt.prototype.render.call(this);
            this.canvas.hideGrid().hide();
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
            this.gradingButtons.select(this.review.getAt('score')).show();
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
            this.gradingButtons.hide();
            this.elements.fieldWriting.text(this.review.get('vocab').get('writing'));
            this.elements.fieldQuestion.text(app.strings.prompt['definition-question']);
            return this;
        },
        /**
         * @method handlePromptClicked
         */
        handlePromptClicked: function() {
            if (this.review.isAnswered()) {
                this.gradingButtons.triggerSelected();
                this.next();
            } else {
                this.renderAnswer();
            }
        },
        /**
         * @method resize
         * @returns {PromptDefn}
         */
        resize: function() {
            Prompt.prototype.resize.call(this);
            var canvasSize = this.canvas.getWidth();
            var contentHeight = app.router.currentPage.getContentHeight();
            var contentWidth = app.router.currentPage.getContentWidth();
            if (app.isPortrait()) {
                this.$el.css({
                    height: contentHeight,
                    width: contentWidth
                });
            } else {
                this.$el.css({
                    height: canvasSize,
                    width: contentWidth
                });
            }
            return this;
        }
    });

    return PromptDefn;
});
