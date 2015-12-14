var GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptToolbarAction
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
     * @property buttonCorrect
     * @type {Boolean}
     */
    buttonCorrect: true,
    /**
     * @property buttonErase
     * @type {Boolean}
     */
    buttonErase: true,
    /**
     * @property buttonShow
     * @type {Boolean}
     */
    buttonShow: true,
    /**
     * @property buttonTeach
     * @type {Boolean}
     */
    buttonTeach: true,
    /**
     * @property events
     * @type Object
     */
    events: {},
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {StudyPromptToolbarAction}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method disableAll
     * @returns {StudyPromptToolbarAction}
     */
    disableAll: function() {
        this.buttonCorrect = false;
        this.buttonErase = false;
        this.buttonShow = false;
        this.buttonTeach = false;
        return this;
    }
});