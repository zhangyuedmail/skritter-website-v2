define([], function() {
    /**
     * @class UserSubscription
     */
    var Model = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change', _.bind(this.cache, this));
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
        },
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem(skritter.user.id + '-subscription', JSON.stringify(this.toJSON()));
        },
        /**
         * @method isActive
         * @returns {Boolean}
         */
        isActive: function() {
            var date = moment(skritter.fn.getUnixTime() * 1000).format('YYYY-MM-DD');
            var expires = this.get('expires');
            if (expires === false) {
                return true;
            }
            if (expires > date) {
                return true;
            }
            return false;
        },
        /**
         * @method canGplay
         * @returns {Boolean}
         */
        canGplay: function() {
            if (!this.get('subscribed') || this.get('subscribed') === 'gplay') {
                return true;
            }
            return false;
        },
        /**
         * @method fetch
         * @param {Function} callback
         */
        fetch: function(callback) {
            skritter.api.getSubscription(skritter.user.id, _.bind(function(result) {
                this.set(result);
                callback();
            }, this));
        },
        /**
         * @method getGplayPlan
         * @returns {String}
         */
        getGplayPlan: function() {
            switch (this.get('gplay_subscription').subscription) {
                case 'one.month.sub':
                    return '1 Month';
                case 'one.year.sub':
                    return '12 Months';
                default:
                    return 'None';
            }
        },
        /**
         * @method subscribeGplay
         * @param {String} sku
         * @param {Function} callback
         */
        subscribeGplay: function(sku, callback) {
            async.waterfall([
                function(callback) {
                    navigator.inappbilling.init(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    navigator.inappbilling.subscribe(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    }, sku);
                },
                function(callback) {
                    skritter.user.subscription.updateGplaySubscription(callback);
                }
            ], function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        updateGplaySubscription: function(callback) {
            async.waterfall([
                function(callback) {
                    navigator.inappbilling.init(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    navigator.inappbilling.getPurchases(function(subscription) {
                        callback(null, subscription[0]);
                    }, function(error) {
                        callback(error);
                    });
                },
                function(subscription, callback) {
                    skritter.api.updateSubscription(skritter.user.id, {
                        gplay_subscription: {
                            subscription: subscription.productId,
                            package: subscription.packageName,
                            token: subscription.purchaseToken
                        }
                    }, function(subscription, status) {
                        if (status === 200) {
                            skritter.user.subscription.set(subscription);
                            callback();
                        } else {
                            callback(subscription);
                        }
                    });
                }
            ], function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        }
    });

    return Model;
});