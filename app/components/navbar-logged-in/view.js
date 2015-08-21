var GelatoComponent = require('gelato/component');

/**
 * @class NavbarLoggedIn
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {NavbarLoggedIn}
     */
    render: function() {
        this.renderTemplate();
        this.$('[data-toggle="tooltip"]').tooltip()
    }
});
