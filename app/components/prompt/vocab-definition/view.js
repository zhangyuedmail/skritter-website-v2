var Component = require('base/component');

/**
 * @class PromptVocabDefinition
 * @extends {Component}
 */
module.exports = Component.extend({
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
        'vclick #show-definition': 'handleClickShow'
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
     * @method getValue
     * @returns {Object}
     */
    getValue: function() {
        return this.$('textarea').val();
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
