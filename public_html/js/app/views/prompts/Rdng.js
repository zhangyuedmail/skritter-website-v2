/**
 * @module Skritter
 * @submodule Views
 * @param templateRdng
 * @param Prompt
 * @author Joshua McFarland
 */
define([
    'require.text!templates/prompt-rdng.html',
    'views/prompts/Prompt'
], function(templateRdng, Prompt) {
    /**
     * @class PromptRdng
     */
    var Rdng = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            skritter.timer.setReviewLimit(30);
            skritter.timer.setThinkingLimit(15);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateRdng);
            Prompt.prototype.render.call(this);
            this.$('#bottom-container').hammer().on('tap', _.bind(this.handleTap, this));
            this.$('#prompt-definition').html(this.review.baseVocab().get('definitions').en);
            this.$('#prompt-reading').html(this.review.baseVocab().reading());
            this.$('#prompt-sentence').html(this.review.baseVocab().sentenceWriting());
            this.$('#prompt-style').html(this.review.baseVocab().style());
            this.$('#prompt-writing').html(this.review.baseVocab().get('writing'));
            skritter.timer.start();
            this.resize();
            return this;
        },
        /**
         * @method handleTap
         * @param {Object} event
         */
        handleTap: function(event) {
            if (Prompt.answerShown) {
                this.handleGradingSelected(Prompt.gradingButtons.grade());
            } else {
                this.showAnswer();
            }
            event.preventDefault();
        },
        /**
         * @method resize
         */
        resize: function() {
            Prompt.prototype.resize.call(this);
            this.$('#top-container').height(63);
            this.$('#top-container').width(skritter.settings.contentWidth());
            this.$('#bottom-container').height(skritter.settings.contentHeight() - this.$('#top-container').height() - 3);
            this.$('#bottom-container').width(skritter.settings.contentWidth());
            this.$('#prompt-reading').fitText(1.2, {maxFontSize: '64px'});
            this.$('#prompt-writing').fitText(0.65, {maxFontSize: '128px'});
        },
        /**
         * @method showAnswer
         */
        showAnswer: function() {
            skritter.timer.stop();
            this.$('.question').hide();
            this.$('.answer').show('fade', 200);
            this.$('#question-text').html('Answer:');
            Prompt.gradingButtons.show();
            Prompt.answerShown = true;
            this.resize();
        }
    });

    return Rdng;
});