const GelatoPage = require('gelato/page');
const AdminPayments = require('collections/AdminPaymentCollection');

/**
 * @class AdminPage
 * @extends {GelatoPage}
 */
const AdminPage = GelatoPage.extend({

  /**
   * @property title
   * @type {String}
   */
  title: 'Admin - Skritter',
  /**
   * @property template
   * @type {Function}
   */
  template: require('./Admin'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function () {
    this.payments = new AdminPayments();
    this.dateStart = moment().subtract(5, 'days');
    this.dateEnd = moment();
    this.listenTo(this.payments, 'state', this.render);
    this.loadSubscriptions();
  },

  /**
   * @method render
   * @returns {AdminPage}
   */
  render: function () {
    this.renderTemplate();
    this.$('#date-range-picker').daterangepicker(
      {
        startDate: this.dateStart,
        endDate: this.dateEnd,
        maxDate: moment(),
        locale: {
          format: 'YYYY-MM-DD',
        },
      },
      _.bind(this.handleChangeDate, this)
    );
    return this;
  },

  /**
   * @method remove
   * @returns {AdminPage}
   */
  remove: function () {
    return GelatoPage.prototype.remove.call(this);
  },

  /**
   * @method handleChangeDate
   * @params {String} start
   * @params {String} end
   */
  handleChangeDate: function (start, end) {
    this.dateEnd = end;
    this.dateStart = start;
    this.loadSubscriptions();
  },

  /**
   * @method loadSubscriptions
   * @returns {AdminPage}
   */
  loadSubscriptions: function () {
    this.payments.fetch({
      data: {
        dateEnd: this.dateEnd.format('YYYY-MM-DD'),
        dateStart: this.dateStart.format('YYYY-MM-DD'),
        limit: 5000,
      },
    });
    return this;
  },

});

module.exports = AdminPage;
