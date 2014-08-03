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
            this.dialog = new GelatoDialog();
            this.sidebar = new GelatoSidebar();
            this.loadUser();
        },
        loadUser: function() {
            this.user = new User();
        }
    });
});