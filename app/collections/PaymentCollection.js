const PaymentModel = require('models/PaymentModel');
const BaseSkritterCollection = require('base/BaseSkritterCollection');

/**
 * @class PaymentCollection
 * @extends {BaseSkritterCollection}
 */
const PaymentCollection = BaseSkritterCollection.extend({

  /**
   * @property model
   * @type {PaymentModel}
   */
  model: PaymentModel,

  /**
   * @property url
   * @type {String}
   */
  url: 'payments',

  /**
   * @method initialize
   * @constructor
   */
  initialize: function () {
    this.cursor = null;
  },

  /**
   * @method parse
   * @param {Object} response
   * @returns Array<Object>
   */
  parse: function (response) {
    this.cursor = response.cursor;

    return response.Payments;
  },
});

module.exports = PaymentCollection;
