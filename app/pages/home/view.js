var GelatoPage = require('gelato/page');
var MarketingFooter = require('components/marketing-footer/view');

/**
 * @class Home
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.footer = new MarketingFooter();
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
        this.footer.setElement('#footer-container').render();;
        return this;
    },
    /**
     * @method remove
     * @returns {Home}
     */
    remove: function() {
        this.footer.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
