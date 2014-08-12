/**
 * @module Application
 */
define([
    "require.i18n!www/locale/nls/strings",
    "framework/GelatoApplication",
    "app/Functions",
    "app/Router",
    "app/models/Api",
    "app/models/Assets",
    "app/models/User",
    "app/models/storage/IndexedDBAdapter",
    "app/views/components/Dialog",
    "app/views/components/Sidebar"
], function(i18n, GelatoApplication, Functions, Router, Api, Assets, User, IndexedDBAdapter, DialogView, SidebarView) {
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
            this.router = new Router();
            this.sidebar = new SidebarView();
            this.strings = i18n;
            async.series([
                async.apply(this.loadApi),
                async.apply(this.loadAssets),
                async.apply(this.loadStorage),
                async.apply(this.loadUser)
            ]);
        },
        /**
         * @method loadApi
         * @param {Function} callback
         */
        loadApi: function(callback) {
            this.api = new Api();
            callback();
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