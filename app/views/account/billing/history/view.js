var GelatoPage = require('gelato/page');

var AccountSidebar = require('components/settings-sidebar/view');
var DefaultNavbar = require('navbars/default/view');
var Payments = require('collections/payments');

/**
 * @class AccountBillingHistory
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.limit = 20;
        this.navbar = new DefaultNavbar();
        this.payments = new Payments();
        this.sidebar = new AccountSidebar();
        this.payments.comparator = function(payment) {
            return -payment.get('created');
        };
        this.listenTo(this.payments, 'sync', this.render);
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
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @property title
     * @type {String}
     */
    title: 'Billing History - Account - Skritter',
    /**
     * @method render
     * @returns {AccountBillingHistory}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
        this.sidebar.setElement('#sidebar-container').render();
        return this;
    },
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
     * @method remove
     * @returns {AccountBillingHistory}
     */
    remove: function() {
        this.navbar.remove();
        this.sidebar.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
