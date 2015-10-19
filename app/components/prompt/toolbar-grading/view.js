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
        'vclick .btn': 'handleClickButton',
        'vmousedown .btn': 'handleMousedownButton'
    },
    /**
     * @method deselect
     * @returns {PromptToolbarGrading}
     */
    deselect: function() {
        this.$('.btn-group .btn').removeClass('selected');
        return this;
    },
    /**
     * @method handleClickButton
     * @param {Event} event
     */
    handleClickButton: function(event) {
        event.preventDefault();
        var target = $(event.currentTarget);
        var value = this.value;
        this.select(parseInt(target.data('value'), 10));
        if (this.value === value) {
            this.trigger('select', this.value);
        } else {
            this.trigger('change', this.value);
        }
    },
    /**
     * @method handleMousedownButton
     * @param {Event} event
     */
    handleMousedownButton: function(event) {
        event.preventDefault();
        var target = $(event.currentTarget);
        this.trigger('mousedown', parseInt(target.data('value'), 10));
        target.addClass('selected');
    },
    /**
     * @method select
     * @param {Number} [value]
     * @returns {PromptToolbarGrading}
     */
    select: function(value) {
        this.deselect();
        if (value) {
            this.$('.btn-group .btn[data-value="' + value + '"]').addClass('selected');
            this.value = value;
        } else {
            this.value = null;
        }
        return this;
    }
});