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
         * @constructor
         */
        initialize: function() {
            this.on('change', this.cache);
        },
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem(app.user.id + '-subscription', JSON.stringify(this.toJSON()));
        }
    });

    return UserSubscription;
});