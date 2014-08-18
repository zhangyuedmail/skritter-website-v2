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
    "app/views/components/Sidebar",
    "app/Params"
], function(i18n, GelatoApplication, Functions, Router, Api, Assets, User, IndexedDBAdapter, DialogView, SidebarView, Params) {
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

            this.params = Params;

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
            var self = this;
            this.user = new User();
            if (this.user.isLoggedIn()) {
                async.series([
                    function(callback) {
                        self.storage.open(self.user.id, callback);
                    },
                    function(callback) {
                        if (!self.user.data.get("lastItemSync")) {
                            self.user.data.downloadAll();
                            callback();
                        } else {
                            self.dialog.show();
                            self.dialog.element(".message-title").text("Loading:");
                            self.user.data.loadAll(function() {
                                self.dialog.hide();
                                callback();
                            });
                        }
                    }
                ], callback);

            } else {
                callback();
            }
        }
    });
});