var SkritterModel = require('base/skritter-model');

/**
 * @class Subscription
 * @extends {SkritterModel}
 */
module.exports = SkritterModel.extend({
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
     * @method getStatus
     */
    getStatus: function() {
        var subscribed = this.get('subscribed');
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
    }
});
