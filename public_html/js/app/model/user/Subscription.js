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
            if (expires !== false || expires <= date) {
                return false;
            }
            return true;
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
                        console.log('subscription error', error);
                    });
                },
                function(callback) {
                    navigator.inappbilling.subscribe(function() {
                       callback(); 
                    }, function(error) {
                        console.log('subscription error', error);
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