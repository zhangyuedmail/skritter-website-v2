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
         * @method sync
         * @param {Function} callback
         */
        sync: function(callback) {
            var self = this;
            app.api.getSubscription(this.user.id, function(data, status) {
                if (status === 200) {
                    self.set(data);
                    callback();
                } else {
                    callback(data, status);
                }
            });
        }
    });

    return UserSubscription;
});