var GelatoSidebar = require('gelato/sidebar');

/**
 * @class DefaultSidebar
 * @extends {GelatoSidebar}
 */
module.exports = GelatoSidebar.extend({
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {DefaultSidebar}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {}
});
