const GelatoCollection = require('gelato/collection');
const AdminPaymentModel = require('models/AdminPaymentModel');

/**
 * @class AdminPaymentCollection
 * @extends {GelatoCollection}
 */
const AdminPaymentCollection = GelatoCollection.extend({

    /**
     * @property model
     * @type {AdminPaymentModel}
     */
    model: AdminPaymentModel,

    /**
     * @method parse
     * @param {Object} response
     * @returns Array
     */
    parse: function (response) {
        return response.Payments;
    },

    /**
     * @property url
     * @type {String}
     */
    url: function () {
        return app.get('nodeApiRoot') + '/v1/admin/payments?token=' + app.user.session.get('access_token');
    },

    /**
     * @method getTotalByDate
     * @returns {Object}
     */
    getTotalByDate: function () {
        let totals = {};
        let groups = _.groupBy(
            this.models,
            function (payment) {
                return payment.get('date');
            }
        );
        _.forEach(
            groups,
            function (payments, key) {
                 let date = {
                     newTotal: 0,
                     newApple: 0,
                     newGoogle: 0,
                     newPaypal: 0,
                     newStripe: 0,
                     returningTotal: 0,
                     returningApple: 0,
                     returningGoogle: 0,
                     returningPaypal: 0,
                     returningStripe: 0,
                 };
                _.forEach(
                    payments,
                    function (payment) {
                        if (payment.isInitialPayment()) {
                            date.newTotal++;
                            switch (payment.get('method')) {
                                case 'apple':
                                    date.newApple++;
                                    break;
                                case 'google':
                                    date.newGoogle++;
                                    break;
                                case 'paypal':
                                    date.newPaypal++;
                                    break;
                                case 'stripe':
                                    date.newStripe++;
                                    break;
                            }
                        } else {
                            date.returningTotal++;
                            switch (payment.get('method')) {
                                case 'apple':
                                    date.returningApple++;
                                    break;
                                case 'google':
                                    date.returningGoogle++;
                                    break;
                                case 'paypal':
                                    date.returningPaypal++;
                                    break;
                                case 'stripe':
                                    date.returningStripe++;
                                    break;
                            }
                        }
                    }
                );
                totals[key] = date;
            }
        );

        return totals;
    },
});

module.exports = AdminPaymentCollection;
