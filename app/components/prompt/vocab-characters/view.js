var GelatoComponent = require('gelato/component');

/**
 * @class PromptVocabCharacters
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
        this.reveal = false;
    },
    /**
     * @property events
     * @type Object
     */
    events: {
        'vclick #show-characters': 'handleClickShowCharacters'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {PromptVocabCharacters}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method handleClickShowCharacters
     * @param {Event} event
     */
    handleClickShowCharacters: function(event) {
        event.preventDefault();
        this.reveal = true;
        this.render();
    }
});
