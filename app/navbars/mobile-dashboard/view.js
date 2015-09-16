var GelatoNavbar = require('gelato/navbar');
var MobileMenuSidebar = require('sidebars/mobile-menu/view');

/**
 * @class DefaultAuthenticatedNavbar
 * @extends {GelatoNavbar}
 */
module.exports = GelatoNavbar.extend({
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick .glyphicon-menu-hamburger': 'handleClickMenuHamburger'
    },
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.sidebar = new MobileMenuSidebar();
    },
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
        this.sidebar.render();
        return this;
    },
    /**
     * @method handleClickMenuHamburger
     */
    handleClickMenuHamburger: function() {
        if (this.sidebar.showing) {
          this.sidebar.close();
        }
        else {
          this.sidebar.open();
        }
        this.sidebar.showing = !this.sidebar.showing;
    }
});
