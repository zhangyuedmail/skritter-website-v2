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
                console.log('PROMPT FINISHED', this.review.save());
                this.trigger('prompt:finished');
            } else {
                skritter.timer.reset();
                this.review.next();
                this.render();
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
         * @method toggleHint
         * @param {Object} event
         */
        toggleHint: function(event) {
            if (this.$('#top-container').hasClass('expanded')) {
                this.$('#top-container').animate({
                    height: '65px'
                }, 500, function() {
                    $(this).removeClass('expanded');
                    $(this).css('z-index', '');
                    $(this).find('#hint-caret').removeClass('fa fa-chevron-up');
                    $(this).find('#hint-caret').addClass('fa fa-chevron-down');
                });
            } else {
                this.$('#top-container').css('z-index', 1002);
                this.$('#top-container').animate({
                    height: this.$('#top-container')[0].scrollHeight + 'px'
                }, 500, function() {
                    $(this).addClass('expanded');
                    $(this).find('#hint-caret').removeClass('fa fa-chevron-down');
                    $(this).find('#hint-caret').addClass('fa fa-chevron-up');
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