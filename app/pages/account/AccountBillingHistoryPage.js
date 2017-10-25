const GelatoPage = require('gelato/page');
const AccountSidebar = require('components/account/AccountSidebarComponent');
const Payments = require('collections/PaymentCollection');

/**
 * @class AccountBillingHistoryPage
 * @extends {GelatoPage}
 */
const AccountBillingHistoryPage = GelatoPage.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #load-more-btn': 'handleClickLoadMoreButton',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./AccountBillingHistory'),

  /**
   * @property title
   * @type {String}
   */
  title: 'Billing - Skritter',

  /**
   * @method initialize
   * @constructor
   */
  initialize: function () {
    this.limit = 20;
    this.payments = new Payments();
    this.sidebar = new AccountSidebar();
    this.payments.comparator = function (payment) {
      return -payment.get('created');
    };
    this.listenTo(this.payments, 'sync', this.render);
    this.fetchPayments();
  },

  /**
   * @method render
   * @returns {AccountBillingHistoryPage}
   */
  render: function () {
    if (app.isMobile()) {
      this.template = require('./MobileAccountBillingHistory.jade');
    }

    this.renderTemplate();
    this.sidebar.setElement('#sidebar-container').render();
    return this;
  },

  /**
   * @method fetchPayments
   * @param {string} cursor
   */
  fetchPayments: function (cursor) {
    this.payments.fetch({
      data: {
        cursor: cursor || '',
        limit: 100,
      },
      remove: false,
    });
  },

  /**
   * @method handleClickLoadMoreButton
   */
  handleClickLoadMoreButton: function () {
    this.fetchPayments(this.payments.cursor);
    this.renderTable();
  },

  /**
   * @method remove
   * @returns {AccountBillingHistoryPage}
   */
  remove: function () {
    this.sidebar.remove();
    return GelatoPage.prototype.remove.call(this);
  },

});

module.exports = AccountBillingHistoryPage;
