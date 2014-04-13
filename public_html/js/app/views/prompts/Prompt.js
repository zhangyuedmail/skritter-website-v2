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
            Prompt.skipSave = false;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            console.log('PROMPT', this.review.vocab().get('writing'), this.review);
            Prompt.gradingButtons.setElement(this.$('#grading-container')).render();
            Prompt.gradingButtons.grade(this.review.at().score);
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
                if (Prompt.skipSave) {
                    this.trigger('prompt:finished');
                } else {
                    this.review.save(_.bind(function() {
                        this.trigger('prompt:finished');
                    }, this));
                }
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
            if (this.$('#info-section').hasClass('expanded')) {
                this.$('#prompt-hint').hide(200, function() {
                    $('#info-section').removeClass('expanded');
                    $('#info-section').find('#hint-caret').removeClass('fa-chevron-up');
                    $('#info-section').find('#hint-caret').addClass('fa-chevron-down');
                    $('#info-section').css('max-height', skritter.settings.contentHeight() - skritter.settings.canvasSize() - 35);
                });
            } else {
                this.$('#info-section').css('max-height', '');
                this.$('#prompt-hint').show(200, function() {
                    $('#info-section').addClass('expanded');
                    $('#info-section').find('#hint-caret').removeClass('fa-chevron-down');
                    $('#info-section').find('#hint-caret').addClass('fa-chevron-up');
                    $('#info-section').css('max-height', skritter.settings.contentHeight() - 15);
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
         * @param {Boolean} skipSave
         */
        set: function(review, skipSave) {
            this.review = review;
            Prompt.skipSave = skipSave ? skipSave : false;
        }
    });

    return Prompt;
});