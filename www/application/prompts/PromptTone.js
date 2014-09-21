/**
 * @module Application
 */
define([
    'prompts/Prompt',
    'require.text!templates/desktop/prompts/prompt-tone.html'
], function(Prompt, DesktopTemplate) {
    /**
     * @class PromptTone
     * @extends {Prompt}
     */
    var PromptTone = Prompt.extend({
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
         * @returns {PromptTone}
         */
        render: function() {
            Prompt.prototype.render.call(this);
            this.$el.html(this.compile(DesktopTemplate));
            this.canvas.hideGrid().show();
            this.enableCanvasListeners();
            this.elements.fieldWriting = this.$('.field-writing');
            if (this.review.isAnswered()) {
                this.renderAnswer();
            } else {
                this.renderQuestion();
            }
            return this;
        },
        /**
         * @method renderElements
         * @returns {PromptTone}
         */
        renderElements: function() {
            return this;
        },
        /**
         * @method renderAnswer
         * @returns {PromptTone}
         */
        renderAnswer: function() {
            this.canvas.disableInput();
            this.gradingButtons.select(this.review.getAt('score')).show();
            this.review.setAt('newInterval', 1000);
            return this;
        },
        /**
         * @method renderQuestion
         * @returns {PromptTone}
         */
        renderQuestion: function() {
            this.canvas.enableInput();
            this.gradingButtons.hide();
            this.elements.fieldWriting.text(this.review.get('vocab').get('writing'));
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
         * @returns {PromptTone}
         */
        resize: function() {
            Prompt.prototype.resize.call(this);
            var canvasSize = this.canvas.getWidth();
            var contentHeight = app.router.currentPage.getContentHeight();
            var contentWidth = app.router.currentPage.getContentWidth();
            if (app.isPortrait()) {
                this.$el.css({
                    'border-bottom': '1px solid #000000',
                    'border-right': 'none',
                    height: contentHeight - canvasSize - 1,
                    width: contentWidth
                });
            } else {
                this.$el.css({
                    'border-bottom': 'none',
                    'border-right': '1px solid #000000',
                    height: canvasSize,
                    width: contentWidth - canvasSize - 1
                });
            }
            return this;
        }
    });

    return PromptTone;
});
