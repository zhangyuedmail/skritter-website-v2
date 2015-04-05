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
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        fetch: function(callbackSuccess, callbackError) {
            var self = this;
            app.api.fetchSubscription(this.user.id, null, function(data) {
                self.set(data, {silent: true});
                callbackSuccess();
            }, function(error) {
                callbackError(error);
            });
        },
        /**
         * @method load
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         * @returns {UserSubscription}
         */
        load: function(callbackSuccess, callbackError) {
            var self = this;
            Async.series([
                function(callback) {
                    self.fetch(function() {
                        callback();
                    }, function() {
                        callback();
                    });
                },
                function(callback) {
                    var cachedItem = localStorage.getItem(self.user.getCachePath('settings', false));
                    if (cachedItem) {
                        self.set(JSON.parse(cachedItem));
                    }
                    callback();
                }
            ], function(error) {
                if (error) {
                    callbackError(error);
                } else {
                    self.cache();
                    callbackSuccess();
                }
            });
            return this;
        },
        /**
         * @method save
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         * @returns {UserSubscription}
         */
        save: function(callbackSuccess, callbackError) {
            var self = this;
            app.api.putSubscription(this.user.id, this.toJSON(), function(result) {
                self.set(result, {silent: true});
                self.cache();
                if (typeof callbackSuccess === 'function') {
                    callbackSuccess(self);
                }
            }, function(error) {
                if (typeof callbackError === 'function') {
                    callbackError(error);
                }
            });
            return this;
        }
    });

    return UserSubscription;

});