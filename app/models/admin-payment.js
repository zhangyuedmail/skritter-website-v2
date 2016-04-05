var GelatoModel = require('gelato/model');

/**
 * @class AdminPayment
 * @extends {GelatoModel}
 */
var AdminPayment = GelatoModel.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {},
    /**
     * @property idAttribute
     * @type {String}
     */
    idAttribute: 'id',
    /**
     * @method isFirstPayment
     * @returns {Array}
     */
    getActualPayments: function() {
        return _.filter(
            this.get('children'),
            function(payment) {
                return payment.service !== 'Coupon';
            }
        );
    },
    /**
     * @method hasPaid
     * @returns {Boolean}
     */
    hasPaid: function() {
        return this.getActualPayments().length > 0;
    },
    /**
     * @method isFirstPayment
     * @returns {Boolean}
     */
    isFirstPayment: function() {
        return this.getActualPayments().length === 1;
    }
});

module.exports = AdminPayment;
