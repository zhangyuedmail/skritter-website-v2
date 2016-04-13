var GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptNavigation
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @param {Object} options
     * @constructor
     */
    initialize: function(options) {
        this.prompt = options.prompt;
        this.reviews = null;
    },
    /**
     * @property events
     * @type Object
     */
    events: {
        'click #save-reviews': 'handleClickSaveReviews'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {StudyPromptNavigation}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method handleClickSaveReviews
     * @param {Event} event
     */
    handleClickSaveReviews: function(event) {
        event.preventDefault();
        this.reviews.post();
    },
    /**
     * @method setReviews
     * @param {Reviews} reviews
     */
    setReviews: function(reviews) {
        this.stopListening();
        this.listenTo(reviews, 'add', this.render);
        this.listenTo(reviews, 'state', this.render);
        this.reviews = reviews;
        return this.render();
    }
});
