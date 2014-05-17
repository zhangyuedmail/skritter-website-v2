/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class UserSubscription
     */
    var Subscription = Backbone.Model.extend({
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
         * @method isExpired
         * @returns {Boolean}
         */
        isExpired: function() {
            var date = moment(skritter.fn.getUnixTime() * 1000).format('YYYY-MM-DD');
            if (this.get('expires') > date) {
                return false;
            }
            return true;
        }
    });
    
    return Subscription;
});