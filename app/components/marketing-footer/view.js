var GelatoComponent = require('gelato/component');

/**
 * @class MarketingFloor
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
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
