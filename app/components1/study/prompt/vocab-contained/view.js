var GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptVocabContained
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
        'vclick .child-decomp': 'handleClickChildDecomp',
        'vclick #show-contained': 'handleClickShowContained'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {StudyPromptVocabContained}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    handleClickChildDecomp: function(event) {
        event.preventDefault();
        console.log(event);
        var $popup = $(event.currentTarget).find('.child-decomp-popup');
        $popup.removeClass('hidden');
    },
    /**
     * @method handleClickShowContained
     * @param {Event} event
     */
    handleClickShowContained: function(event) {
        event.preventDefault();
        this.prompt.review.set('showContained', true);
        this.render();
    }
});
