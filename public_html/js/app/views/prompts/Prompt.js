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
            'click.Prompt .prompt-container #info-button': 'toggleInfo'
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
        toggleInfo: function(event) {
            var maxInfoHeight = skritter.settings.contentHeight() - skritter.settings.canvasSize() - 35;
            if (this.$('#info-section').hasClass('expanded')) {
                this.$('#info-section').animate({
                    height: maxInfoHeight,
                    'max-height': 'auto'
                }, 200, function() {
                    $(this).css('height', 'auto');
                    $(this).css('max-height', maxInfoHeight);
                    $(this).removeClass('expanded');
                    $(this).find('#info-button').removeClass('fa-times-circle');
                    $(this).find('#info-button').addClass('fa-info-circle');
                });
            } else {
                this.$('#info-section').animate({
                    height: skritter.settings.contentHeight() - 15,
                    'max-height': 'auto'
                }, 200, function() {
                    $(this).addClass('expanded');
                    $(this).find('#info-button').removeClass('fa-info-circle');
                    $(this).find('#info-button').addClass('fa-times-circle');
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