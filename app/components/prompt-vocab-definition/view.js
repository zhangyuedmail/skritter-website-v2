var GelatoComponent = require('gelato/component');

/**
 * @class PromptVocabDefinition
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
     * @returns {PromptVocabDefinition}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method set
     * @param {PromptReviews} reviews
     * @returns {PromptVocabDefinition}
     */
    set: function(reviews) {
        this.reviews = reviews;
        this.stopListening();
        this.listenTo(this.reviews, 'change', this.render);
        return this.render();
    }
});
