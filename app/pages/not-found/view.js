var GelatoPage = require('gelato/page');
var DefaultNavbar = require('navbars/default/view');
var MarketingNavbar = require('navbars/marketing/view');

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
        if (app.user.isLoggedIn()) {
            this.navbar = new DefaultNavbar();
        } else {
            this.navbar = new MarketingNavbar();
        }
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
        this.navbar.render();
        return this;
    }
});
