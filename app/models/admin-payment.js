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
     * @method getAllPayments
     * @returns {Array}
     */
    getAllPayments: function() {
        return _.filter(
            this.get('children'),
            function(payment) {
                return payment.service !== 'Coupon';
            }
        );
    },
    /**
     * @method isInitialPayment
     * @returns {Boolean}
     */
    isInitialPayment: function() {
        return this.getAllPayments().length === 1;
    }
});

module.exports = AdminPayment;
