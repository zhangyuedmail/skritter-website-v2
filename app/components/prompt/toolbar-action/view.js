var GelatoComponent = require('gelato/component');

/**
 * @class PromptToolbarAction
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
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {PromptToolbarAction}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @property events
     * @type Object
     */
    events: {
        'click #toolbar-correct': 'handleClickOptionCorrect',
        'click #toolbar-erase': 'handleClickOptionErase',
        'click #toolbar-show': 'handleClickOptionShow',
        'click #toolbar-stroke-order': 'handleClickOptionTeach'
    },
    /**
     * @method handleClickOptionCorrect
     * @param {Event} event
     */
    handleClickOptionCorrect: function(event) {
        event.preventDefault();
        this.trigger('click:correct');
    },
    /**
     * @method handleClickOptionErase
     * @param {Event} event
     */
    handleClickOptionErase: function(event) {
        event.preventDefault();
        this.trigger('click:erase');
    },
    /**
     * @method handleClickOptionShow
     * @param {Event} event
     */
    handleClickOptionShow: function(event) {
        event.preventDefault();
        this.trigger('click:show');
    },
    /**
     * @method handleClickOptionTeach
     * @param {Event} event
     */
    handleClickOptionTeach: function(event) {
        event.preventDefault();
        this.trigger('click:teach');
    }
});