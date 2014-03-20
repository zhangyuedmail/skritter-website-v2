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
            skritter.timer.setThinkingLimit(15)
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateRdng);
            Prompt.prototype.render.call(this);
            this.$('#prompt-definition').html(this.review.baseVocab().get('definitions').en);
            this.$('#prompt-reading').html(this.review.baseVocab().reading());
            this.$('#prompt-sentence').html(this.review.baseVocab().get('sentenceId'));
            this.$('#prompt-writing').html(this.review.baseVocab().get('writing'));
            this.$('#bottom-container').hammer().on('tap', _.bind(this.handleTap, this));
            this.resize();
            return this;
        },
        /**
         * @method handleTap
         * @param {Object} event
         */
        handleTap: function(event) {
            this.showAnswer();
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
        },
        showAnswer: function() {
            this.$('.question').hide();
            this.$('.answer').show('fade', 200);
            this.$('#question-text').html('Answer:');
            Prompt.gradingButtons.show();
        }
    });

    return Rdng;
});