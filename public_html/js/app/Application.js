define([
    'model/Api',
    'model/Assets',
    'Functions',
    'model/storage/IndexedDBAdapter',
    'view/component/Modal',
    'router/Router',
    'model/Schema',
    'model/Settings',
    'require.locale!../../locale/nls/strings',
    'view/component/Timer',
    'model/User',
    'model/storage/WebSQLAdapter'
], function(Api, Assets, Functions, IndexedDBAdapter, Modal, Router, Schema, Settings, Strings, Timer, User, WebSQLAdapter) {
    /**
     * @method loadApi
     * @param {Function} callback
     */
    var loadApi = function(callback) {
        skritter.api = new Api();
        callback();
    };
    /**
     * @method loadAssets
     * @param {Function} callback
     */
    var loadAssets = function(callback) {
        skritter.assets = new Assets();
        callback();
    };
    /**
     * @method loadFunctions
     * @param {Function} callback
     */
    var loadFunctions = function(callback) {
        skritter.fn = Functions;
        callback();
    };
    /**
     * @method loadApi
     * @param {Function} callback
     */
    var loadModal = function(callback) {
        skritter.modal = new Modal();
        callback();
    };
    /**
     * @method loadSchema
     * @param {Function} callback
     */
    var loadSchema = function(callback) {
        skritter.schema = new Schema();
        callback();
    };
    /**
     * @method loadApi
     * @param {Function} callback
     */
    var loadSettings = function(callback) {
        skritter.settings = new Settings();
        callback();
    };
    /**
     * @method loadApi
     * @param {Function} callback
     */
    var loadStorage = function(callback) {
        if (Modernizr.indexeddb) {
            skritter.storage = new IndexedDBAdapter();
        } else {
            skritter.storage = new WebSQLAdapter();
        }
        callback();
    };
    /**
     * @method loadApi
     * @param {Function} callback
     */
    var loadStrings = function(callback) {
        skritter.strings = Strings;
        callback();
    };
    /**
     * @method loadTimer
     * @param {Function} callback
     */
    var loadTimer = function(callback) {
        skritter.timer = new Timer();
        callback();
    };
    /**
     * @method loadApi
     * @param {Function} callback
     */
    var loadUser = function(callback) {
        skritter.user = new User();
        if (skritter.user.isLoggedIn()) {
            async.series([
                function(callback) {
                    skritter.storage.open(skritter.user.id, callback);
                },
                function(callback) {
                    skritter.user.data.reviews.loadAll(callback);
                },
                function(callback) {
                    skritter.user.data.srsconfigs.loadAll(callback);
                },
                function(callback) {
                    skritter.user.data.vocablists.loadAll(callback);
                },
                function(callback) {
                    skritter.user.scheduler.loadAll(callback);
                }
            ], function() {
                //load daily timer prog stats in background
                skritter.timer.refresh(true);
                //checks if user has downloaded account
                if (skritter.user.data.isInitial()) {
                    skritter.modal.show('download')
                        .set('.modal-body', false)
                        .set('.preparing .message', 'Preparing Download')
                        .set('.preparing .message-value', '0 KB');
                    skritter.user.data.downloadAll(function() {
                        skritter.modal.hide();
                    });
                } else {
                    //skritter.user.sync.fetchChanged();
                }
                //load raygun and bind userid to analytics
                if (skritter.fn.hasCordova()) {
                    navigator.analytics.setUserId(skritter.user.getName());
                    if (skritter.fn.hasRaygun()) {
                        Raygun.withCustomData(skritter.user.getCustomData);
                        Raygun.withTags(skritter.user.getTags());
                        Raygun.setUser(skritter.user.getName());
                        Raygun.saveIfOffline(true);
                    }
                } else {
                    window.Raygun = undefined;
                }
                callback();
            });
        } else {
            callback();
        }
    };
    /**
     * @method initialize
     */
    var initialize = function() {
        async.series([
            async.apply(loadFunctions),
            async.apply(loadApi),
            async.apply(loadAssets),
            async.apply(loadModal),
            async.apply(loadSchema),
            async.apply(loadSettings),
            async.apply(loadStorage),
            async.apply(loadStrings),
            async.apply(loadTimer),
            async.apply(loadUser)
        ], function() {
            console.log('application initialized');
            skritter.router = new Router();
            if (skritter.fn.hasCordova()) {
                navigator.splashscreen.hide();
            }
        });
    };

    return {
        initialize: initialize
    };
});