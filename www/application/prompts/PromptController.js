/**
 * @module Application
 */
define([
    'framework/BaseView',
    'require.text!templates/desktop/prompts/prompt.html',
    'prompts/PromptCanvas',
    'prompts/PromptGradingButtons',
    'prompts/PromptDefn',
    'prompts/PromptRdng',
    'prompts/PromptRune',
    'prompts/PromptTone',
], function(BaseView, DesktopTemplate, PromptCanvas, PromptGradingButtons, PromptDefn, PromptRdng, PromptRune, PromptTone) {
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
            this.listenTo(app, 'resize', this.resize);
        },
        /**
         * @method render
         * @returns {PromptController}
         */
        render: function() {
            this.$el.append(this.compile(DesktopTemplate));
            this.canvas.setElement(this.$('.canvas-container')).render();
            this.gradingButtons.setElement(this.$('.grading-container')).render();
            this.elements.canvasContainer = this.$('.canvas-container');
            this.elements.gradingContainer = this.$('.grading-container');
            this.elements.prompt = this.$('.prompt');
            this.renderElements();
            this.resize();
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
         * @method load
         * @param {Review} review
         * @returns {PromptController}
         */
        load: function(review) {
            this.reset();
            console.log('PROMPT:', review.get('itemId'), this);
            switch (review.get('part')) {
                case 'defn':
                    this.active = new PromptDefn(null, this, review);
                    break;
                case 'rdng':
                    this.active = new PromptRdng(null, this, review);
                    break;
                case 'rune':
                    this.active = new PromptRune(null, this, review);
                    break;
                case 'tone':
                    this.active = new PromptTone(null, this, review);
                    break;
            }
            this.active.render();
            return this;
        },
        /**
         * @method reset
         * @returns {PromptController}
         */
        reset: function() {
            if (this.active) {
                this.active.remove();
                this.active = undefined;
            }
            return this;
        },
        /**
         * @method resize
         * @returns {PromptController}
         */
        resize: function() {
            var contentHeight = app.router.currentPage.getContentHeight();
            var contentWidth = app.router.currentPage.getContentWidth();
            if (app.isPortrait()) {
                this.canvas.resize(contentWidth);
                this.elements.prompt.height(contentHeight);
            } else {
                this.canvas.resize(contentHeight);
                this.elements.prompt.height(this.canvas.getWidth());
            }
            if (this.active) {
                this.active.resize();
            }
            return this;
        },
        /**
         * @method triggerNext
         */
        triggerNext: function() {
            this.trigger('next');
        },
        /**
         * @method triggerPrevious
         */
        triggerPrevious: function() {
            this.trigger('previous');
        }
    });

    return PromptController;
});
