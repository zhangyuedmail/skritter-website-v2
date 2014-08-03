/**
 * @module Application
 */
define([
    "framework/GelatoModel"
], function(GelatoModel) {
    return GelatoModel.extend({
        /**
         * @class UserData
         * @extends GelatoModel
         * @constructor
         */
        initialize: function() {},
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem(app.user.id + "-data", JSON.stringify(this.toJSON()));
        }
    });
});
