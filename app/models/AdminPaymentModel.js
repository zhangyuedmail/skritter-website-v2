const GelatoModel = require('gelato/model');

/**
 * @class AdminPaymentModel
 * @extends {GelatoModel}
 */
const AdminPaymentModel = GelatoModel.extend({

  /**
   * @property idAttribute
   * @type {String}
   */
  idAttribute: 'id',

  /**
   * @method getAllPayments
   * @returns {Array}
   */
  getAllPayments: function() {
    return _.filter(
      this.get('children'),
      function(payment) {
        return payment.charged && payment.service !== 'Coupon';
      }
    );
  },

  /**
   * @method isInitialPayment
   * @returns {Boolean}
   */
  isInitialPayment: function() {
    return this.getAllPayments().length === 1;
  },

});

module.exports = AdminPaymentModel;
