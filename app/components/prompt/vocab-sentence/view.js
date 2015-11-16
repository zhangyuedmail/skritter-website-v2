var Component = require('base/component');

/**
 * @class PromptVocabSentence
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
        'vclick .value': 'handleClickValue'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {PromptVocabSentence}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method handleClickValue
     * @param {Event} event
     */
    handleClickValue: function(event) {
        event.preventDefault();
        if (this.$('.hint').hasClass('open')) {
            this.$('.hint').removeClass('open');
            this.$('.hint').hide('slide', {direction: 'up'}, '500');
        } else {
            this.$('.hint').addClass('open');
            this.$('.hint').show('slide', {direction: 'up'}, '500');
        }

    }
});
