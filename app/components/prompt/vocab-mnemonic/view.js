var GelatoComponent = require('gelato/component');

/**
 * @class PromptVocabMnemonic
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @param {Object} options
     * @constructor
     */
    initialize: function(options) {
        this.editable = false;
        this.prompt = options.prompt;
        this.reveal = false;
    },
    /**
     * @property events
     * @type Object
     */
    events: {
        'vclick #show-mnemonic': 'handleClickShowMnemonic'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {PromptVocabMnemonic}
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
        return {text: this.$('textarea').val()}
    },
    /**
     * @method handleClickShowMnemonic
     * @param {Event} event
     */
    handleClickShowMnemonic: function(event) {
        event.preventDefault();
        this.reveal = true;
        this.render();
    }
});
