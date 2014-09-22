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
            this.character = undefined;
        },
        /**
         * @method render
         * @returns {PromptRune}
         */
        render: function() {
            this.$el.html(this.compile(DesktopTemplate));
            Prompt.prototype.render.call(this);
            this.renderQuestion();
            if (this.review.isAnswered()) {
                this.renderAnswer();
            }
            return this;
        },
        /**
         * @method renderAnswer
         * @returns {PromptRune}
         */
        renderAnswer: function() {
            this.canvas.disableInput();
            this.elements.fieldWriting.text(this.vocab.getWriting());
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
            this.elements.fieldDefinition.text(this.vocab.getDefinition());
            this.elements.fieldReading.text(this.vocab.getReading());
            this.character = this.review.getCharacter();
            this.gradingButtons.hide();
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
            var stroke = this.character.recognizeStroke(points, shape);
            if (stroke) {
                this.canvas.lastMouseDownEvent = null;
                this.canvas.tweenShape('stroke', stroke.getUserShape(), stroke.getShape());
                if (this.character.isComplete()) {
                    this.renderAnswer();
                }
            } else {
                //TODO: handle incorrect character input
            }
        },
        /**
         * @method reset
         * @returns {PromptRune}
         */
        reset: function() {
            Prompt.prototype.reset.call(this);
            this.canvas.clearAll().showGrid().show();
            this.character = undefined;
            this.enableCanvasListeners();
            this.enableGradingListeners();
            return this;
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
