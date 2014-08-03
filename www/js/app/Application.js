/**
 * @module Application
 */
define([
    "framework/GelatoApplication",
    "app/views/components/Dialog",
    "app/views/components/Sidebar",
    "app/models/User"
], function(GelatoApplication, Dialog, Sidebar, User) {
    return GelatoApplication.extend({
        /**
         * @class Application
         * @extends GelatoApplication
         * @constructor
         */
        initialize: function() {
            _.bindAll(this);
            this.dialog = new Dialog();
            this.sidebar = new Sidebar();
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