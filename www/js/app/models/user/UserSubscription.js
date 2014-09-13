/**
 * @module Application
 */
define([
    "framework/GelatoModel"
], function(GelatoModel) {
    return GelatoModel.extend({
        /**
         * @class UserSubscription
         * @extends GelatoModel
         * @constructor
         */
        initialize: function() {
            this.on("change", this.cache);
        },
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem(app.user.id + "-subscription", JSON.stringify(this.toJSON()));
        },
        /**
         * @method sync
         * @param {Function} callback
         */
        sync: function(callback) {
            var self = this;
            app.api.getSubscription(app.user.id, function(data, status) {
                if (status === 200) {
                    self.set(data);
                    callback();
                } else {
                    callback(data, status);
                }
            });
        }
    });
});
