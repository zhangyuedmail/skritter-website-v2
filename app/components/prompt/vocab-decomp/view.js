var GelatoComponent = require('gelato/component');

/**
 * @class PromptVocabDecomp
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
        'vclick #show-decomp': 'handleClickShowDecomp'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {PromptVocabDecomp}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method handleClickShowDecomp
     * @param {Event} event
     */
    handleClickShowDecomp: function(event) {
        event.preventDefault();
        this.reveal = true;
        this.render();
    }
});
