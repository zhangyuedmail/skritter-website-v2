/**
 * @module Skritter
 * @param Api
 * @param Assets
 * @param Functions
 * @param IndexedDBAdapter
 * @param Modal
 * @param Params
 * @param Router
 * @param Settings
 * @param Timer
 * @param User
 * @author Joshua McFarland
 */
define([
    'model/Api',
    'model/Assets',
    'Functions',
    'model/storage/IndexedDBAdapter',
    'view/component/Modal',
    'collection/data/Params',
    'Router',
    'model/Settings',
    'view/component/Timer',
    'model/User'
], function(Api, Assets, Functions, IndexedDBAdapter, Modal, Params, Router, Settings, Timer, User) {
    /**
     * @method initialize
     */
    var initialize = function() {
        //creates the global skritter namespace
        window.skritter = (function(skritter) {
            return skritter;
        })(window.skritter || {});
        //asynchronously loads all of the required modules
        async.series([
            async.apply(loadApi),
            async.apply(loadAssets),
            async.apply(loadFunctions),
            async.apply(loadModal),
            async.apply(loadParams),
            async.apply(loadSettings),
            async.apply(loadStorage),
            async.apply(loadTimer),
            async.apply(loadUser),
            async.apply(loadRouter)
        ], function() {
            //perform specific cordova tasks before initialization
            if (window.cordova) {
                navigator.splashscreen.hide();
            }
            console.log('Application Initialized');
        });
    };
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
     * @method loadModals
     * @param {Function} callback
     */
    var loadModal = function(callback) {
        skritter.modal = new Modal().render();
        callback();
    };
    /**
     * @method loadParams
     * @param {Function} callback
     */
    var loadParams = function(callback) {
        skritter.params = new Params();
        callback();
    };
    /**
     * @method loadRouter
     * @param {Function} callback
     */
    var loadRouter = function(callback) {
        skritter.router = new Router();
        callback();
    };
    /**
     * @method loadSettings
     * @param {Function} callback
     */
    var loadSettings = function(callback) {
        skritter.settings = new Settings();
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
     * @method loadStorage
     * @param {Function} callback
     */
    var loadStorage = function(callback) {
        skritter.storage = new IndexedDBAdapter();
        callback();
    };
    /**
     * @method loadUser
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
                    skritter.user.scheduler.load(callback);
                },
                function(callback) {
                    skritter.user.data.loadResources(callback);
                }
            ], function() {
                //load raygun javascript error logging module
                if (window.Raygun) {
                    Raygun.init('906oc84z1U8uZga3IJ9uPw==').attach().withCustomData([
                        skritter.user.settings.toJSON()
                    ]).withTags(skritter.user.settings.getTags());
                    Raygun.setUser(skritter.user.id);
                    Raygun.setVersion(skritter.settings.getVersion());
                }
                callback();
            });
        } else {
            callback();
        }
    };

    return {
        initialize: initialize
    };
});