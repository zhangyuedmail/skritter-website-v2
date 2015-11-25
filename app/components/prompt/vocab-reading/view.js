var GelatoComponent = require('gelato/component');

/**
 * @class PromptVocabReading
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
    },
    /**
     * @property events
     * @type Object
     */
    events: {
        'vclick .show-reading': 'handleClickShowReading'
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
     * @method handleClickShowReading
     * @param {Event} event
     */
    handleClickShowReading: function(event) {
        event.preventDefault();
        var $reading = $(event.target).parent('.reading');
        this.trigger('click:show', $reading.data('position'));
    }
});
