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
        if (this.get('subscribed') === 'gplay') {
            return 'Subscribed through Google Play';
        }
        if (this.get('subscribed') === 'ios') {
            return 'Subscribed through Apple';
        }
        if (this.get('subscribed') === 'paypal') {
            return 'Subscribed through Paypal';
        }
        if (this.get('subscribed') === 'ios') {
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
