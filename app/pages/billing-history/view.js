var GelatoPage = require('gelato/page');
var SettingsSidebar = require('components/settings-sidebar/view');
var DefaultNavbar = require('navbars/default/view');
var Payments = require('collections/payments');

/**
 * @class BillingHistory
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
        'click #load-more-btn': 'handleClickLoadMoreButton'
    },
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
