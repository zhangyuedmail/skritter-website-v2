var GelatoNavbar = require('gelato/navbar');

/**
 * @class MarketingNavbar
 * @extends {GelatoNavbar}
 */
module.exports = GelatoNavbar.extend({
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {MarketingNavbar}
     */
    render: function() {
        this.renderTemplate();
        return this;
    }
});
