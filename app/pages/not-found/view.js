var GelatoPage = require('gelato/page');

/**
 * @class NotFound
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.navbar = this.createComponent('navbars/marketing');
    },
    /**
     * @property bodyClass
     * @type {String}
     */
    bodyClass: 'background2',
    /**
     * @property title
     * @type {String}
     */
    title: 'Not Found - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {NotFound}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
        return this;
    }
});
