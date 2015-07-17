var GelatoComponent = require('gelato/component');

/**
 * @class PromptGrading
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @param {Object} [options]
     * @constructor
     */
    initialize: function(options) {
        options = options || {};
        this.prompt = options.prompt;
        this.value = null;
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('components/prompt-grading/template'),
    /**
     * @method render
     * @returns {PromptGrading}
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
     * @returns {PromptGrading}
     */
    select: function(value) {
        this.unselect();
        if (value) {
            this.$('.btn-group .btn[data-value="' + value + '"]').addClass('selected');
            this.value = value;
        } else {
            this.value = null;
        }
        return this;
    },
    /**
     * @method unselect
     * @returns {PromptGrading}
     */
    unselect: function() {
        this.$('.btn-group .btn').removeClass('selected');
        return this;
    }
});