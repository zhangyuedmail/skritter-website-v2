var GelatoPage = require('gelato/page');
var MarketingFooter = require('components/marketing-footer/view');
var DefaultNavbar = require('navbars/default/view');
var MarketingNavbar = require('navbars/marketing/view');

/**
 * @class Features
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.footer = new MarketingFooter();
        if (app.user.isLoggedIn()) {
            this.navbar = new DefaultNavbar();
        } else {
            this.navbar = new MarketingNavbar();
        }
    },
    /**
     * @property events
     * @type Object
     */
    events: {},
    /**
     * @property title
     * @type {String}
     */
    title: 'Features- Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {Contact}
     */
    render: function() {
        this.renderTemplate();
        this.footer.setElement('#footer-container');
        this.footer.render();
        this.navbar.render();
        return this;
    },
    /**
     * @method remove
     * @returns {Contact}
     */
    remove: function() {
        this.navbar.remove();
        this.footer.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
