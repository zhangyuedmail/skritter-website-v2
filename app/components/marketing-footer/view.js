var Component = require('base/component');

/**
 * @class MarketingFloor
 * @extends {Component}
 */
module.exports = Component.extend({
    /**
     * @property template
     * @type {Function}
     */
    template: require('components/marketing-footer/template'),
    /**
     * @method render
     * @returns {Component}
     */
    render: function() {
        this.renderTemplate();
        return this;
    }
});
