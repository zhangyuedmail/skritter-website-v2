var GelatoPage = require('gelato/page');
var SettingsSidebar = require('components/settings-sidebar/view');
var DefaultNavbar = require('navbars/default/view');
var Payments = require('collections/payments');

/**
 * @class BillingSubscription
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @property bodyClass
     * @type {String}
     */
    bodyClass: 'background1',
    /**
     * @property events
     * @type {Object}
     */
    events: {
    },
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.navbar = new DefaultNavbar();
        this.sidebar = new SettingsSidebar();
    },
    /**
     * @method remove
     */
    remove: function() {
        this.navbar.remove();
        this.sidebar.remove();
        return GelatoPage.prototype.remove.call(this);
    },
    /**
     * @method render
     * @returns {VocablistBrowse}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.render();
        this.sidebar.setElement('#settings-sidebar-container').render();
        return this;
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @property title
     * @type {String}
     */
    title: 'Subscription - Skritter',
    /**
     * @method renderTable
     */
    renderTable: function() {
        var context = require('globals');
        context.view = this;
        var rendering = $(this.template(context));
        this.$('.table-oversized-wrapper').replaceWith(rendering.find('.table-oversized-wrapper'));
    }
});
