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
            this.listenTo(Prompt.gradingButtons, 'selected', this.handleGradingSelected);
            this.listenTo(skritter.settings, 'resize', this.resize);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            Prompt.gradingButtons.setElement(this.$('#grading-container')).render();
            console.log('PROMPT', this.review.vocab().get('writing'), this.review);
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
                    height: '300px'
                }, 500, function() {
                    $(this).addClass('expanded');
                    $(this).find('#hint-caret').removeClass('fa fa-chevron-down');
                    $(this).find('#hint-caret').addClass('fa fa-chevron-up');
                });
            }
            event.preventDefault();
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