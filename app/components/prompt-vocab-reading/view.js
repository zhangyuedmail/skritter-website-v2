var GelatoComponent = require('gelato/component');

/**
 * @class PromptVocabReading
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.reviews = null;
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {PromptVocabReading}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method set
     * @param {PromptReviews} reviews
     * @returns {PromptVocabReading}
     */
    set: function(reviews) {
        this.reviews = reviews;
        this.stopListening();
        this.listenTo(this.reviews, 'change', this.render);
        return this.render();
    }
});
