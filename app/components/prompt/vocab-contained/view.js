var GelatoComponent = require('gelato/component');

/**
 * @class PromptVocabContained
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
        'vclick #show-contained': 'handleClickShow'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {PromptVocabContained}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method handleClickShow
     * @param {Event} event
     */
    handleClickShow: function(event) {
        event.preventDefault();
        this.trigger('click:show');
    }
});
