const SkritterModel = require('base/BaseSkritterModel');

/**
 * @class CouponModel
 * @extends {SkritterModel}
 */
const CouponModel = SkritterModel.extend({

  /**
   * @property idAttribute
   * @type {String}
   */
  idAttribute: 'id',

  /**
   * @property urlRoot
   */
  urlRoot: 'coupons',

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.wasUsed = false;
    this.error = '';
  },

  /**
   * @method parse
   * @returns {Object}
   */
  parse: function(response) {
    return response.Coupon || response;
  },

  /**
   * @method use
   * @returns {jqXHR|null}
   */
  use: function() {
    this.error = '';
    if (!this.get('code')) {
      this.error = 'No code provided';
      return;
    }
    this.listenToOnce(this, 'sync', this.useSync);
    this.listenToOnce(this, 'error', this.useError);
    return this.save(null, {
      url: app.getApiUrl() + 'coupons/' + this.get('code') + '/use',
      method: 'POST'
    });
  },

  /**
   * @method useError
   * @param {CouponModel} model
   * @param {jqXHR} jqxhr
   */
  useError: function(model, jqxhr) {
    this.error = jqxhr.responseJSON.message;
    this.stopListening(this, 'sync', this.useSync);
    this.trigger('state', this);
  },

  /**
   * @method useSync
   */
  useSync: function(model, response) {
    this.subscriptionAttributes = response.Subscription;
    this.wasUsed = true;
    this.stopListening(this, 'error', this.useError);
    this.trigger('state', this);
  }

});

module.exports = CouponModel;
