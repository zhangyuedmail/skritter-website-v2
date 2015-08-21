var GelatoNavbar = require('gelato/navbar');

/**
 * @class DefaultAuthenticatedNavbar
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
     * @returns {DefaultAuthenticatedNavbar}
     */
    render: function() {
        this.renderTemplate();
        this.$('[data-toggle="tooltip"]').tooltip();
        return this;
    }
});
