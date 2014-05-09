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
            this.gradingButtons = null;
            this.review = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            console.log('PROMPT', this.review.getBaseVocab().get('writing'), this.review.get('part'), this.review);
            this.gradingButtons = new GradingButtons();
            this.gradingButtons.setElement(this.$('#grading-container')).render();
            this.gradingButtons.grade(this.review.getReviewAt().score);
            this.$('.character-font').addClass(this.review.getBaseVocab().getFontClass());
            this.listenTo(this.gradingButtons, 'selected', this.handleGradingSelected);
            this.listenTo(skritter.settings, 'resize', this.resize);
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'vclick #prompt-reading': 'playAudio'
        },
        /**
         * @method handleGradingSelected
         * @param {Number} selectedGrade
         */
        handleGradingSelected: function(selectedGrade) {
            this.review.setReviewAt(null, {
                reviewTime: skritter.timer.getReviewTime(),
                score: selectedGrade,
                thinkingTime: skritter.timer.getThinkingTime()
            });
            if (this.review.isLast()) {
                this.review.save(_.bind(function() {
                    this.trigger('prompt:finished');
                }, this));
            } else {
                this.next();
            }
        },
        /**
         * @method next
         */
        next: function() {
            skritter.timer.reset();
            this.review.next();
            this.gradingButtons.grade(this.review.getReviewAt().score);
            if (this.review.getReview().finished) {
                this.clear().show().showAnswer();
                this.resize();
            } else {
                skritter.timer.start();
                this.clear().show();
            }
        },
        /**
         * @method playAudio
         * @param {Object} event
         */
        playAudio: function(event) {
            this.review.getBaseVocab().playAudio();
            event.preventDefault();
        },
        /**
         * @method previous
         */
        previous: function() {
            skritter.timer.stop();
            this.review.previous();
            this.gradingButtons.grade(this.review.getReviewAt().score);
            if (this.review.getReview().finished) {
                this.clear().show().showAnswer();
                this.resize();
            } else {
                this.clear().show();
            }
            this.resize();
        },
        /**
         * @method remove
         */
        remove: function() {
            this.gradingButtons.remove();
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
        },
        /**
         * @method resize
         */
        resize: function() {
            if (window.cordova || skritter.settings.appWidth() <= skritter.settings.get('maxCanvasSize')) {
                $('#content-container').addClass('full-width');
            } else {
                $('#content-container').removeClass('full-width');
            }
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