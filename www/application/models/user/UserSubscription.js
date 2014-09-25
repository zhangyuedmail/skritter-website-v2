/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class UserSubscription
     * @extends BaseModel
     */
    var UserSubscription = BaseModel.extend({
        /**
         * @method initialize
         * @param {User} user
         * @constructor
         */
        initialize: function(attributes, options) {
            this.user = options.user;
            this.on('change', this.cache);
        },
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem(this.user.id + '-subscription', JSON.stringify(this.toJSON()));
        },
        /**
         * @method fetch
         * @param {Function} callback
         */
        fetch: function(callback) {
            var self = this;
            app.api.getSubscription(this.user.id, null, function(data) {
                self.set(data);
                callback();
            }, function(error) {
                callback(error);
            });
        },
        /**
         * @method update
         * @param {Function} callback
         */
        update: function(callback) {
            var self = this;
            app.api.updateSubscription(this.toJSON(), function(subscription) {
                self.set(subscription);
                callback();
            }, function(error) {
                callback(error);
            });
        }
    });

    return UserSubscription;
});