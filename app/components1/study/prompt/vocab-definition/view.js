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
        'vclick #show-definition': 'handleClickShow'
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
     * @method handleClickShow
     * @param {Event} event
     */
    handleClickShow: function(event) {
        event.preventDefault();
        this.trigger('click:show');
    }
});
