var GelatoPage = require('gelato/page');
var MarketingFooter = require('components/marketing-footer/view');

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
        this.navbar = this.createComponent('navbars/marketing');
    },
    /**
     * @property bodyClass
     * @type {String}
     */
    bodyClass: '',
    /**
     * @property events
     * @type Object
     */
    events: {},
    /**
     * @property title
     * @type {String}
     */
    title: 'Features - Skritter',
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
        this.footer.setElement('#footer-container').render();
        this.navbar.setElement('#navbar-container').render();
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
