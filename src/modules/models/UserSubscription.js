/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class UserSubscription
     * @extends GelatoModel
     */
    var UserSubscription = GelatoModel.extend({
        /**
         * @method initialize
         * @param {Object} [attributes]
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(attributes, options) {
            options = options || {};
            this.user = options.user;
            this.on('change', this.cache);
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {},
        /**
         * @method cache
         * @returns {UserSubscription}
         */
        cache: function() {
            localStorage.setItem(this.user.getCachePath('subscription', false), JSON.stringify(this.toJSON()));
            return this;
        },
        /**
         * @method fetch
         * @param {Function} callback
         */
        fetch: function(callback) {
            var self = this;
            app.api.fetchSubscription(this.user.id, null, function(data) {
                self.set(data);
                callback();
            }, function(error) {
                callback(error);
            });
        },
        /**
         * @method loadCache
         * @returns {UserSubscription}
         */
        loadCache: function() {
            var item = localStorage.getItem(this.user.getCachePath('subscription', false));
            if (item) {
                this.set(JSON.parse(item), {silent: true});
            }
            return this;
        }
    });

    return UserSubscription;

});