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
            this.canvas.showGrid().show();
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
            this.canvas.disableInput();
            this.gradingButtons.select(this.review.getAt('score')).show();
            this.review.setAt('newInterval', 1000);
            return this;
        },
        /**
         * @method renderQuestion
         * @returns {PromptRune}
         */
        renderQuestion: function() {
            this.canvas.enableInput();
            this.gradingButtons.hide();
            this.elements.fieldWriting.text(this.review.get('vocab').get('writing'));
            return this;
        },
        /**
         * @method handlePromptClicked
         * @param {Event} event
         */
        handleCanvasClicked: function() {
            if (this.review.isAnswered()) {
                this.gradingButtons.triggerSelected();
                this.next();
            } else {
                //TODO: show single stroke hint
            }
        },
        /**
         * @method handleInputUp
         */
        handleInputUp: function(points, shape) {
            this.canvas.lastMouseDownEvent = null;
        },
        /**
         * @method resize
         * @returns {PromptRune}
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
                    width: canvasSize
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

    return PromptRune;
});
