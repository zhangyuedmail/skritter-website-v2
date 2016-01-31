var GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptNavigation
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
        'vclick #navigate-next': 'handleClickNavigateNext',
        'vclick #navigate-previous': 'handleClickNavigatePrevious'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {StudyPromptNavigation}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method handleClickNavigateNext
     * @param {Event} event
     */
    handleClickNavigateNext: function(event) {
        event.preventDefault();
        this.prompt.next();
    },
    /**
     * @method handleClickNavigatePrevious
     * @param {Event} event
     */
    handleClickNavigatePrevious: function(event) {
        event.preventDefault();
        this.prompt.previous();
    }
});