var GelatoComponent = require('gelato/component');

/**
 * @class PromptVocabCharacter
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
        'vclick #show-character': 'handleClickShowCharacter'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {PromptVocabCharacter}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method handleClickShowCharacter
     * @param {Event} event
     */
    handleClickShowCharacter: function(event) {
        event.preventDefault();
        this.reveal = true;
        this.render();
    }
});
