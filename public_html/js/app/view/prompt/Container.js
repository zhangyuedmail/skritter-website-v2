define([
    'require.text!template/prompt.html',
    'view/View',
    'view/prompt/Canvas',
    'view/prompt/GradingButtons',
    'view/prompt/PromptDefn',
    'view/prompt/PromptRdng',
    'view/prompt/PromptRune',
    'view/prompt/PromptTone',
    'view/prompt/TeachingButtons'
], function(template, View, Canvas, GradingButtons, PromptDefn, PromptRdng, PromptRune, PromptTone, TeachingButtons) {
    /**
     * @class PromptContainer
     */
    var PromptContainer = View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.canvas = new Canvas();
            this.gradingButtons = new GradingButtons();
            this.prompt = null;
            this.promptDefn = new PromptDefn(this);
            this.promptRdng = new PromptRdng(this);
            this.promptRune = new PromptRune(this);
            this.promptTone = new PromptTone(this);
            this.teachingButtons = new TeachingButtons();
        },
        /**
         * @method render
         * @returns {PromptContainer}
         */
        render: function() {
            this.$el.html(_.template(template, skritter.strings));
            this.canvas.setElement('.canvas-container').render();
            this.gradingButtons.setElement(this.$('.grading-container')).render();
            this.teachingButtons.setElement(this.$('.teaching-container')).render();
            this.resize();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'vclick .button-eraser': 'handleClickEraser',
            'vclick .button-reveal': 'handleClickReveal'
        },
        /**
         * @method loadElements
         * @returns {PromptContainer}
         */
        loadElements: function() {
        },
        /**
         * @method clear
         * @returns {PromptContainer}
         */
        clear: function() {
            this.canvas.clear();
            this.$('.info-section .button-eraser').show();
            this.$('.info-section .button-reveal').show();
            this.$('.prompt-answer').hide();
            this.$('.prompt-question').hide();
            this.$('.prompt-field').empty();
            return this;
        },
        /**
         * @method handleClickEraser
         * @param {Object} event
         */
        handleClickEraser: function(event) {
            this.prompt.handleClickEraser(event);
            event.preventDefault();
        },
        /**
         * @method handleClickReveal
         * @param {Object} event
         */
        handleClickReveal: function(event) {
            this.prompt.handleClickReveal(event);
            event.preventDefault();
        },
        /**
         * @method loadPrompt
         */
        loadPrompt: function(review) {
            console.log('review', review.id, review.toJSON());
            this.reset();
            switch (review.get('part')) {
                case 'defn':
                    this.prompt = this.promptDefn;
                    break;
                case 'rdng':
                    this.prompt = this.promptRdng;
                    break;
                case 'rune':
                    this.prompt = this.promptRune;
                    break;
                case 'tone':
                    this.prompt = this.promptTone;
                    break;
            }
            this.prompt.canvas = this.canvas;
            this.prompt.gradingButtons = this.gradingButtons;
            this.prompt.review = review;
            this.prompt.teachingButtons = this.teachingButtons;
            this.prompt.vocab = review.getBaseVocab();
            this.prompt.show().enableListeners();
            skritter.user.scheduler.sort();
        },
        /**
         * @method reset
         * @returns {PromptContainer}
         */
        reset: function() {
            this.clear();
            this.canvas.hide();
            this.gradingButtons.hide();
            this.teachingButtons.hide();
            return this;
        },
        /**
         * @method resize
         */
        resize: function() {
            var canvasSize = skritter.settings.getCanvasSize();
            var contentHeight = skritter.settings.getContentHeight();
            var contentWidth = skritter.settings.getContentWidth();
            if (skritter.settings.isPortrait()) {
                this.$('.input-section').css({
                    height: canvasSize,
                    float: 'none',
                    width: contentWidth
                });
                this.$('.info-section').css({
                    height: contentHeight - canvasSize,
                    float: 'none',
                    width: contentWidth
                });
            } else {
                this.$('.input-section').css({
                    height: canvasSize,
                    float: 'left',
                    width: canvasSize
                });
                this.$('.info-section').css({
                    height: contentHeight,
                    float: 'left',
                    width: contentWidth - canvasSize
                });
            }
        },
        /**
         * @method triggerNext
         */
        triggerNext: function() {
            this.prompt.hide();
            this.trigger('next');
        },
        /**
         * @method triggerPrevious
         */
        triggerPrevious: function() {
            this.prompt.hide();
            this.trigger('previous');
        }
    });

    return PromptContainer;
});