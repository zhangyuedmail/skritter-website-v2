var GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptVocabDefinition
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @param {Object} options
     * @constructor
     */
    initialize: function(options) {
        this.editing = false;
        this.prompt = options.prompt;
    },
    /**
     * @property events
     * @type Object
     */
    events: {
        'click #show-definition': 'handleClickShowDefinition'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {StudyPromptVocabDefinition}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method getValue
     * @returns {Object}
     */
    getValue: function() {
        return this.$('textarea').val();
    },
    /**
     * @method handleClickShowDefinition
     * @param {Event} event
     */
    handleClickShowDefinition: function(event) {
        event.preventDefault();
        this.prompt.reviews.forEach(function(review) {
            review.set('showDefinition', true);
        });
        this.render();
    }
});
