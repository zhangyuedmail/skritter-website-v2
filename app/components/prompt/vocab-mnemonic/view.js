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
    },
    /**
     * @property events
     * @type Object
     */
    events: {
        'vclick #show-mnemonic': 'handleClickShow'
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
     * @method handleClickShow
     * @param {Event} event
     */
    handleClickShow: function(event) {
        event.preventDefault();
        this.trigger('click:show')
    }
});
