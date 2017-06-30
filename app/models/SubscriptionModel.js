const SkritterModel = require('base/BaseSkritterModel');

/**
 * @class SubscriptionModel
 * @extends {SkritterModel}
 */
const SubscriptionModel = SkritterModel.extend({

  /**
   * @property idAttribute
   * @type {String}
   */
  idAttribute: 'id',

  /**
   * @property urlRoot
   */
  urlRoot: 'subscriptions',

  /**
   * @method parse
   * @returns {Object}
   */
  parse: function(response) {
    return response.Subscription || response;
  },

  /**
   * @method sync
   * @param {String} method
   * @param {Model} model
   * @param {Object} options
   */
  sync: function(method, model, options) {
    options.headers = _.result(this, 'headers');

    if (!options.url) {
      options.url = app.getApiUrl() + _.result(this, 'url');
    }

    if (method === 'read' && app.config.useV2Gets.subscriptions) {
      options.url = app.getApiUrl(2) + 'gae/subscriptions/' + app.user.id;
    }

    SkritterModel.prototype.sync.call(this, method, model, options);
  },

  /**
   * @method getStatus
   */
  getStatus: function() {
    const subscribed = this.get('subscribed');

    if (subscribed === 'gplay') {
      return 'Subscribed through Google Play';
    }
    if (subscribed === 'ios') {
      return 'Subscribed through Apple';
    }
    if (subscribed === 'paypal') {
      return 'Subscribed through Paypal';
    }
    if (subscribed === 'stripe' || subscribed === 'anet') {
      return 'Subscribed through Skritter Website';
    }
    if (!this.get('expires')) {
      return 'Free';
    }
    if (new Date(this.get('expires')).getTime() > new Date().getTime()) {
      return 'Active';
    }

    return 'Expired';
  },

  /**
   * @method isExpired
   * @returns {boolean}
   */
  isExpired: function() {
    return this.getStatus() === 'Expired';
  },

  /**
   * @method isSubscribed
   * @returns {boolean}
   */
  isSubscribed: function() {
    return this.get('subscribed');
  },

  /**
   * @method restoreSubscription
   */
  restoreSubscription: function() {
    if (app.isAndroid() && plugins.billing) {
      plugins.billing.getPurchases('subs')
        .then(result => {
          if (result && result.length) {
              this.set('gplay_subscription', {
                subscription: result[0].productId,
                package: result[0].packageName,
                token: result[0].purchaseToken
              }).save();
            }
          }
        );
    }
  }

});

module.exports = SubscriptionModel;
