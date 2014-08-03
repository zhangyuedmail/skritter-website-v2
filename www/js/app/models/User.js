define([
    "framework/GelatoModel",
    "app/models/user/Settings"
], function(GelatoModel, UserSettings) {
    return GelatoModel.extend({
        /**
         * @class User
         * @extends GelatoModel
         * @constructor
         */
        initialize: function() {
            this.settings = new UserSettings();
        }
    });
});
