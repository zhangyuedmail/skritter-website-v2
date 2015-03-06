/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class UserStats
     * @extends GelatoModel
     */
    var UserStats = GelatoModel.extend({
        /**
         * @method initialize
         * @param {Object} [attributes]
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(attributes, options) {
            options = options === undefined ? {} : options;
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
         * @returns {UserStats}
         */
        cache: function() {
            localStorage.setItem(this.user.getCachePath('stats', true), JSON.stringify(this.toJSON()));
            return this;
        },
        /**
         * @method fetch
         * @param {Function} callback
         */
        fetch: function(callback) {
            var self = this;
            app.api.fetchStats(null, function(data) {
                self.set(data);
                callback();
            }, function(error) {
                callback(error);
            });
        },
        /**
         * @method loadCache
         * @returns {UserStats}
         */
        loadCache: function() {
            var item = localStorage.getItem(this.user.getCachePath('stats', true));
            if (item) {
                this.set(JSON.parse(item), {silent: true});
            }
            return this;
        }
    });

    return UserStats;

});