/**
 * @module Application
 */
define([
    'framework/BaseView',
    'prompts/PromptCanvas',
    'prompts/PromptGradingButtons',
    'prompts/PromptDefn',
    'prompts/PromptRdng',
    'prompts/PromptRune',
    'prompts/PromptTone',
], function(BaseView, PromptCanvas, PromptGradingButtons, PromptDefn, PromptRdng, PromptRune, PromptTone) {
    /**
     * @class PromptContainer
     * @extends {BaseView}
     */
    var PromptContainer = BaseView.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.canvas = new PromptCanvas();
            this.gradingButtons = new PromptGradingButtons();
            this.review = undefined;
            this.listenTo(app, 'resize', this.resize);
        },
        /**
         * @method render
         * @returns {PromptContainer}
         */
        render: function() {
            this.canvas.setElement(this.$('.canvas-container')).render();
            this.gradingButtons.setElement(this.$('.grading-buttons-container')).render();
            this.renderElements();
            this.resize();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PromptContainer}
         */
        renderElements: function() {
            return this;
        },
        /**
         * @method loadPrompt
         * @param {Review} review
         * @returns {PromptContainer}
         */
        loadPrompt: function(review) {
            this.review = review;
            return this;
        },
        /**
         * @method resize
         * @returns {PromptContainer}
         */
        resize: function() {
            this.canvas.resize(this.getWidth());
            return this;
        }
    });

    return PromptContainer;
});
