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
            Prompt.gradingButtons = new GradingButtons();
            this.review = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            Prompt.gradingButtons.setElement(this.$('#grading-container')).render();
            return this;
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