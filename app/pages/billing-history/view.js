var Page = require('base/page');
var DefaultNavbar = require('navbars/default/view');
var SettingsSidebar = require('components/settings-sidebar/view');
var Payments = require('collections/payments');

/**
 * @class BillingHistory
 * @extends {Page}
 */
module.exports = Page.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.navbar = new DefaultNavbar();
        this.sidebar = new SettingsSidebar();
        this.payments = new Payments();
        this.payments.comparator = function(payment) {
            return -payment.get('created');
        };
        this.listenTo(this.payments, 'sync', this.renderTable);
        this.limit = 20;
        this.fetchPayments();
    },
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
        'vclick #load-more-btn': 'handleClickLoadMoreButton'
    },
    /**
     * @method remove
     */
    remove: function() {
        this.navbar.remove();
        this.sidebar.remove();
        return Page.prototype.remove.call(this);
    },
    /**
     * @method render
     * @returns {VocablistBrowse}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
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
    title: 'Billing History - Skritter',
    /**
     * @method fetchPayments
     * @param {string} cursor
     */
    fetchPayments: function(cursor) {
        this.payments.fetch({
            data: {
                cursor: cursor || '',
                limit: 100
            },
            remove: false
        });
    },
    /**
     * @method handleClickLoadMoreButton
     */
    handleClickLoadMoreButton: function() {
        this.fetchPayments(this.payments.cursor);
        this.renderTable();
    },
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
