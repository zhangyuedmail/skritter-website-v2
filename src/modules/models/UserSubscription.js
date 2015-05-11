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
         * @constructor
         */
        initialize: function() {
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
            localStorage.setItem(app.user.getDataPath('subscription', false), JSON.stringify(this.toJSON()));
            return this;
        },
        /**
         * @method fetch
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        fetch: function(callbackSuccess, callbackError) {
            var self = this;
            app.api.fetchSubscription(app.user.id, null, function(data) {
                self.set(data, {merge: true});
                if (typeof callbackSuccess === 'function') {
                    callbackSuccess();
                }
            }, function(error) {
                if (typeof callbackError === 'function') {
                    callbackError(error);
                }
            });
        },
        /**
         * @method load
         * @returns {UserSubscription}
         */
        load: function() {
            var subscription = localStorage.getItem(app.user.getDataPath('subscription', false));
            if (subscription) {
                this.set(JSON.parse(subscription), {silent: true});
            }
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
            app.api.putSubscription(app.user.id, this.toJSON(), function(result) {
                self.set(result, {merge: true});
                self.cache();
                if (typeof callbackSuccess === 'function') {
                    callbackSuccess(self);
                }
            }, function(error) {
                self.cache();
                if (typeof callbackError === 'function') {
                    callbackError(error);
                }
            });
            return this;
        }
    });

    return UserSubscription;

});