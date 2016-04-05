var GelatoCollection = require('gelato/collection');
var AdminPayment = require('models/admin-payment');

/**
 * @class AdminPayments
 * @extends {GelatoCollection}
 */
var AdminPayments = GelatoCollection.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {},
    /**
     * @property model
     * @type {AdminPayment}
     */
    model: AdminPayment,
    /**
     * @method parse
     * @param {Object} response
     * @returns Array
     */
    parse: function(response) {
        return response.Payments;
    },
    /**
     * @property url
     * @type {String}
     */
    url: function() {
        return 'http://localhost:8080/v1/admin/payments?token=' + app.user.session.get('access_token');
    },
    /**
     * @method getTotalByDate
     * @returns {Object}
     */
    getTotalByDate: function() {
        var totals = {};
        var groups = _.groupBy(
            this.models,
            function(payment) {
                return payment.get('date');
            }
        );
        _.forEach(
            groups,
            function(payments, key) {
                 var date = {total: 0, first: 0};
                _.forEach(
                    payments,
                    function(payment) {
                        if (payment.hasPaid()) {
                            date.total++;
                        }
                        if (payment.isFirstPayment()) {
                            date.first++;
                        }
                    }
                );
                totals[key] = date;
            }
        );
        return totals;
    }
});

module.exports = AdminPayments;
