/**
 * @module Skritter
 * @submodule Views
 * @param GradingButtons
 * @author Joshua McFarland
 */
define([
    'views/prompts/GradingButtons'
], function(GradingButtons) {
    /**
     * @class Prompt
     */
    var Prompt = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.review = null;
            Prompt.gradingButtons = new GradingButtons();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            console.log('PROMPT', this.review.vocab().get('writing'), this.review);
            Prompt.gradingButtons.setElement(this.$('#grading-container')).render();
            this.$('.character-font').addClass(this.review.baseVocab().fontClass());
            this.listenTo(Prompt.gradingButtons, 'selected', this.handleGradingSelected);
            this.listenTo(skritter.settings, 'resize', this.resize);
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Prompt .prompt-container #hint-caret': 'toggleHint'
        },
        /**
         * @method handleGradingSelected
         * @param {Number} selectedGrade
         */
        handleGradingSelected: function(selectedGrade) {
            this.review.at({
                reviewTime: skritter.timer.getReviewTime(),
                thinkingTime: skritter.timer.getThinkingTime(),
                score: selectedGrade
            });
            if (this.review.isLast()) {
                this.review.save(_.bind(function() {
                    this.trigger('prompt:finished');
                }, this));
            } else {
                skritter.timer.reset();
                Prompt.gradingButtons.grade(3);
                this.review.next();
                this.clear().show();
            }
        },
        /**
         * @method handleTap
         * @param {Object} event
         */
        handleTap: function(event) {
            this.handleGradingSelected(Prompt.gradingButtons.grade());
            event.preventDefault();
        },
        /**
         * @method toggleInfo
         * @param {Object} event
         */
        toggleHint: function(event) {
            var actualInfoHeight = this.$('#info-section')[0].scrollHeight;
            var defaultInfoHeight = skritter.settings.contentHeight() - skritter.settings.canvasSize() - 35;
            var maxInfoHeight = skritter.settings.contentHeight();
            if (this.$('#info-section').hasClass('expanded')) {
                this.$('#info-section').animate({
                    height: defaultInfoHeight,
                    'max-height': 'auto'
                }, 200, function() {
                    $(this).css('height', 'auto');
                    $(this).css('max-height', defaultInfoHeight);
                    $(this).removeClass('expanded');
                    $(this).find('#hint-caret').removeClass('fa-chevron-up');
                    $(this).find('#hint-caret').addClass('fa-chevron-down');
                });
            } else {
                this.$('#info-section').animate({
                    height: actualInfoHeight > maxInfoHeight ? maxInfoHeight : actualInfoHeight,
                    'max-height': 'auto'
                }, 200, function() {
                    $(this).addClass('expanded');
                    $(this).find('#hint-caret').removeClass('fa-chevron-down');
                    $(this).find('#hint-caret').addClass('fa-chevron-up');
                });
            }
            event.preventDefault();
        },
        /**
         * @method remove
         */
        remove: function() {
            Prompt.gradingButtons.remove();
            this.$el.empty();
            this.stopListening();
            this.undelegateEvents();
        },
        /**
         * @method resize
         */
        resize: function() {
            //TODO: add general resizing logic
        },
        /**
         * @method set
         * @param {Backbone.Model} review
         */
        set: function(review) {
            this.review = review;
        }
    });

    return Prompt;
});