var GelatoComponent = require('gelato/component');

/**
 * @class PromptToolbarGrading
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
        this.value = null;
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {PromptToolbarGrading}
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
        'vmousedown button': 'handleMousedownButton',
        'vmouseup button': 'handleMouseupButton'
    },
    /**
     * @method deselect
     * @returns {PromptToolbarGrading}
     */
    deselect: function() {
        this.value = null;
        this.render();
        return this;
    },
    /**
     * @method handleMousedownButton
     * @param {Event} event
     */
    handleMousedownButton: function(event) {
        event.preventDefault();
        var $target = $(event.currentTarget);
        var value = parseInt($target.data('value'), 10);
        this.trigger('mousedown', value);
        this.select(value);
    },
    /**
     * @method handleMousedownButton
     * @param {Event} event
     */
    handleMouseupButton: function(event) {
        event.preventDefault();
        this.trigger('mouseup', this.value);
    },
    /**
     * @method select
     * @param {Number} [value]
     * @returns {PromptToolbarGrading}
     */
    select: function(value) {
        this.value = value || null;
        this.render();
        return this;
    }
});