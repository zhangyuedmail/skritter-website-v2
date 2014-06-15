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
    'model/User'
], function(Api, Assets, Functions, IndexedDBAdapter, Modal, Router, Schema, Settings, Strings, Timer, User) {
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
        skritter.storage = new IndexedDBAdapter();
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
                    skritter.user.scheduler.loadAll(callback);
                },
                function(callback) {
                    if (skritter.user.sync.isFirst()) {
                        skritter.modal.show('download')
                                .set('.modal-title', 'Initial Download')
                                .set('.modal-title-icon', null, 'fa-download')
                                .progress(100);
                        skritter.user.sync.downloadAll(function() {
                            window.location.reload(true);
                        });
                    } else {
                        callback();
                    }
                }
            ], function() {
                //load daily timer prog stats in background
                skritter.timer.refresh(true);
                //load raygun javascript error logging module
                if (!skritter.fn.hasCordova() && window.Raygun) {
                    Raygun.init('906oc84z1U8uZga3IJ9uPw==').attach()
                            .withCustomData(skritter.user.getCustomData)
                            .withTags(skritter.user.getTags());
                    Raygun.setUser(skritter.user.id);
                    Raygun.setVersion(skritter.settings.getVersion());
                    Raygun.saveIfOffline(true);
                } else if (window.Raygun) {
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
        //creates the global skritter namespace
        window.skritter = (function(skritter) {
            return skritter;
        })(window.skritter || {});
        //asynchronously loads all required modules
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
                window.navigator.splashscreen.hide();
            }
            skritter.modal.hide();
        });
    };

    return {
        initialize: initialize
    };
});