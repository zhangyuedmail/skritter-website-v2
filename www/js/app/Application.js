/**
 * @module Application
 */
define([
    "framework/GelatoApplication",
    "framework/GelatoDialog",
    "framework/GelatoSidebar",
    "app/models/User"
], function(GelatoApplication, GelatoDialog, GelatoSidebar, User) {
    return GelatoApplication.extend({
        /**
         * @class Application
         * @extends GelatoApplication
         * @constructor
         */
        initialize: function() {
            _.bindAll(this);
            this.dialog = new GelatoDialog();
            this.sidebar = new GelatoSidebar();
            async.series([
                async.apply(this.loadUser)
            ]);
        },
        /**
         * @method loadUser
         * @param {Function} callback
         */
        loadUser: function(callback) {
            this.user = new User();
            callback();
        }
    });
});