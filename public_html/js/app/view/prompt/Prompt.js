/**
 * @module Skritter
 * @submodule Views
 * @param GradingButtons
 * @author Joshua McFarland
 */
define([
    'view/prompt/GradingButtons'
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
            console.log('PROMPT', this.review.getBaseVocab().get('writing'), this.review.get('part'), this.review);
            Prompt.gradingButtons.setElement(this.$('#grading-container')).render();
            Prompt.gradingButtons.grade(this.review.getReviewAt().score);
            this.$('.character-font').addClass(this.review.getBaseVocab().getFontClass());
            this.listenTo(Prompt.gradingButtons, 'selected', this.handleGradingSelected);
            this.listenTo(skritter.settings, 'resize', this.resize);
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
        },
        /**
         * @method handleGradingSelected
         * @param {Number} selectedGrade
         */
        handleGradingSelected: function(selectedGrade) {
            this.review.getReviewAt({
                score: selectedGrade
            });
            if (this.review.isLast()) {
                this.review.save(_.bind(function() {
                    this.trigger('prompt:finished');
                }, this));
            } else {
                this.next();
            }
        },
        next: function() {
            //skritter.timer.reset();
            this.review.next();
            Prompt.gradingButtons.grade(this.review.getReviewAt().score);
            this.clear().show();
        },
        /**
         * @method remove
         */
        remove: function() {
            Prompt.gradingButtons.remove();
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
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
         * @param {Boolean} skipSave
         */
        set: function(review, skipSave) {
            this.review = review;
            Prompt.skipSave = skipSave ? skipSave : false;
        }
    });

    return Prompt;
});