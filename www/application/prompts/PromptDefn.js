/**
 * @module Application
 */
define([
    'prompts/Prompt',
    'require.text!templates/prompts/prompt-defn.html'
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
            app.timer.setLimits(30, 15);
            this.$el.html(this.compile(DesktopTemplate));
            Prompt.prototype.render.call(this);
            this.canvas.hideGrid().hide();
            return this;
        },
        /**
         * @method renderAnswer
         * @returns {PromptDefn}
         */
        renderAnswer: function() {
            Prompt.prototype.renderAnswer.call(this);
            if (app.user.settings.get('audio')) {
                this.vocab.playAudio();
            }
            this.elements.fieldDefinition.html(this.vocab.getDefinition());
            if (app.user.settings.get('showHeisig') && this.vocab.has('heisigDefinition')) {
                this.elements.fieldHeisig.text('Keyword: ' + this.vocab.get('heisigDefinition'));
            }
            this.elements.fieldQuestion.hide();
            this.elements.fieldWriting.html(this.vocab.getWriting());
            return this;
        },
        /**
         * @method renderQuestion
         * @returns {PromptDefn}
         */
        renderQuestion: function() {
            Prompt.prototype.renderQuestion.call(this);
            this.elements.fieldQuestion.html(app.strings.prompt['definition-question']);
            this.elements.fieldWriting.html(this.vocab.getWriting());
            return this;
        },
        /**
         * @method handlePromptClicked
         * @param {Event} event
         */
        handlePromptClicked: function(event) {
            Prompt.prototype.handlePromptClicked.call(this, event);
            if (this.review.getAt('answered')) {
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
