var Page = require('base/page');
var DefaultNavbar = require('navbars/default/view');
var MarketingFooter = require('components/marketing-footer/view');

/**
 * @class Home
 * @extends {Page}
 */
module.exports = Page.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.footer = new MarketingFooter();
        this.navbar = new DefaultNavbar();
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'Home - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {Home}
     */
    render: function() {
        this.renderTemplate();
        this.footer.setElement('#footer-container').render();
        this.navbar.setElement('#navbar-container').render();
        return this;
    },
    /**
     * @method remove
     * @returns {Home}
     */
    remove: function() {
        this.footer.remove();
        this.navbar.remove();
        return Page.prototype.remove.call(this);
    }
});
