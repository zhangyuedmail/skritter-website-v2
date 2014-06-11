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
         * @method getPlan
         * @returns {Object}
         */
        getWebsitePlan: function() {
            var plan = null;
            if (this.get('expires') === false) {
                plan = 'Unlimited';
            } else {
                switch (this.get('plan')) {
                    case 'one_month':
                        plan = '1 Month';
                        break;
                    case 'six_months':
                        plan = '6 Months';
                        break;
                    case 'twelve_months':
                        plan = '1 Year';
                        break;
                    case 'twenty_four_months':
                        plan = '2 Years';
                        break;
                }
            }
            return plan;
        },
        /**
         * @method getGplayPlan
         * @returns {String}
         */
        getGplayPlan: function() {
            var plan = null;
            switch (this.get('gplay_subscription')) {
                case 'one.month.sub':
                    plan = '1 Month';
                    break;
                case 'one.year.sub':
                    plan = '1 Year';
                    break;
            }
            return plan;
        },
        /**
         * @method getType
         * @returns {String}
         */
        getType: function() {
            var type = null;
            switch (this.get('subscribed')) {
                case 'gplay':
                    type = 'Google Play';
                    break;
                case 'ios':
                    type = 'iTunes Store';
                    break;
                case 'skritter':
                    type = 'Website';
                    break;
                default:
                    type = 'None';
                    break;
            }
            return type;
        },
        /**
         * @method isExpired
         * @returns {Boolean}
         */
        isExpired: function() {
            var date = moment(skritter.fn.getUnixTime() * 1000).format('YYYY-MM-DD');
            var expires = this.get('expires');
            if (expires === false || expires > date) {
                return false;
            }
            return true;
        },
        /**
         * @method subscribe
         */
        subscribeWeb: function() {
            window.location.href = 'https://beta.skritter.com/account/billing/subscribe/mobile';
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
                        console.log('SUBSCRIBE ERROR', error);
                    });
                },
                function(callback) {
                    navigator.inappbilling.subscribe(function() {
                       callback(); 
                    }, function(error) {
                        console.log('SUBSCRIBE ERROR', error);
                    }, sku);
                }
            ], function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method sync
         * @param {Function} callback
         */
        sync: function(callback) {
            skritter.api.getSubscription(skritter.user.id, _.bind(function(result) {
                this.set(result);
                callback();
            }, this));
        }
    });
    
    return Model;
});