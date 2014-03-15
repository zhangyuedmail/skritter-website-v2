/**
 * @module Skritter
 * @submodule Views
 * @param templateDefn
 * @param Prompt
 * @author Joshua McFarland
 */
define([
    'require.text!templates/prompt-defn.html',
    'views/prompts/Prompt'
], function(templateDefn, Prompt) {
    /**
     * @class PromptRune
     */
    var Rune = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateDefn);
            Prompt.prototype.render.call(this);
            this.$('#prompt-definition').html(this.review.vocab().get('definitions').en);
            this.$('#prompt-reading').html(this.review.vocab().get('reading'));
            this.$('#prompt-sentence').html(this.review.vocab().get('sentenceId'));
            this.$('#prompt-writing').html(this.review.vocab().get('writing'));
            this.$('#bottom-container').hammer().on('tap', _.bind(this.handleTap, this));
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

    return Rune;
});