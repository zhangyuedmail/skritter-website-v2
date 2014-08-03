/**
 * @module Application
 */
define([
    "framework/GelatoApplication",
    "app/views/components/Dialog",
    "app/views/components/Sidebar",
    "app/models/Assets",
    "app/models/User"
], function(GelatoApplication, Dialog, Sidebar, Assets, User) {
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
                async.apply(this.loadAssets),
                async.apply(this.loadUser)
            ]);
        },
        /**
         * @method loadAssets
         * @param {Function} callback
         */
        loadAssets: function(callback) {
            this.assets = new Assets();
            this.assets.loadAll(callback);
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