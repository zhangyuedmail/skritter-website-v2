/**
 * @module Application
 */
define([
    "framework/GelatoApplication",
    "app/Functions",
    "app/models/Assets",
    "app/models/User",
    "app/models/storage/IndexedDBAdapter",
    "app/views/components/Dialog",
    "app/views/components/Sidebar"
], function(GelatoApplication, Functions, Assets, User, IndexedDBAdapter, DialogView, SidebarView) {
    return GelatoApplication.extend({
        /**
         * @class Application
         * @extends GelatoApplication
         * @constructor
         */
        initialize: function() {
            _.bindAll(this);
            this.fn = Functions;
            this.dialog = new DialogView();
            this.sidebar = new SidebarView();
            async.series([
                async.apply(this.loadAssets),
                async.apply(this.loadStorage),
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
         * @method loadStorage
         * @param {Function} callback
         */
        loadStorage: function(callback) {
            this.storage = new IndexedDBAdapter();
            callback();
        },
        /**
         * @method loadUser
         * @param {Function} callback
         */
        loadUser: function(callback) {
            this.user = new User();
            if (this.user.isLoggedIn()) {
                this.storage.open(this.user.id, callback);
            } else {
                callback();
            }
        }
    });
});