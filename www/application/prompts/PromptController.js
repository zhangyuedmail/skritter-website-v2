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
     * @class PromptController
     * @extends {BaseView}
     */
    var PromptController = BaseView.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.active = undefined;
            this.canvas = new PromptCanvas();
            this.gradingButtons = new PromptGradingButtons();
            this.review = undefined;
            this.listenTo(app, 'resize', this.resize);
        },
        /**
         * @method render
         * @returns {PromptController}
         */
        render: function() {
            this.canvas.setElement(this.$('.canvas-container')).render().show().enableInput();
            this.gradingButtons.setElement(this.$('.grading-buttons-container')).render();
            this.types = {
                defn: new PromptDefn(this),
                rdng: new PromptRdng(this),
                rune: new PromptRune(this),
                tone: new PromptTone(this)
            };
            this.renderElements();
            this.resize();
            this.reset();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PromptController}
         */
        renderElements: function() {
            return this;
        },
        /**
         * @method loadPrompt
         * @param {Review} review
         * @returns {PromptController}
         */
        loadPrompt: function(review) {
            this.review = review;
            return this;
        },
        /**
         * @method reset
         * @returns {PromptController}
         */
        reset: function() {
            for (var type in this.types) {
                this.types[type].reset();
            }
            return this;
        },
        /**
         * @method resize
         * @returns {PromptController}
         */
        resize: function() {
            this.canvas.resize(this.getWidth());
            return this;
        }
    });

    return PromptController;
});
