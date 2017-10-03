const SkritterModel = require('base/BaseSkritterModel');

/**
 * @class PaymentModel
 * @extends {SkritterModel}
 */
const PaymentModel = SkritterModel.extend({

  /**
   * @property idAttribute
   * @type {String}
   */
  idAttribute: 'id',

  /**
   * @property urlRoot
   */
  urlRoot: 'payments',

  /**
   * @method parse
   * @returns {Object}
   */
  parse: function (response) {
    return response.Payment || response;
  },

  /**
   * @method getChargedAmount
   * @returns {String}
   */
  getChargedAmount: function () {
    if (this.get('localCharged')) {
      return this.get('localCharged');
    }
    if (!this.get('charged')) {
      return '';
    }
    return '$' + parseFloat(this.get('charged')).toFixed(2);
  },

});

module.exports = PaymentModel;
