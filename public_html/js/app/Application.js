/**
 * @module Skritter
 * @param Api
 * @param Assets
 * @param Functions
 * @param IndexedDBAdapter
 * @param Modals
 * @param Params
 * @param Router
 * @param Settings
 * @param Timer
 * @param User
 * @param WebSQLAdapter
 * @author Joshua McFarland
 */
define([
    'models/Api',
    'models/Assets',
    'Functions',
    'models/storage/IndexedDBAdapter',
    'views/components/Modals',
    'collections/data/Params',
    'Router',
    'models/Settings',
    'views/components/Timer',
    'models/User',
    'models/storage/WebSQLAdapter'
], function(Api, Assets, Functions, IndexedDBAdapter, Modals, Params, Router, Settings, Timer, User, WebSQLAdapter) {
    /**
     * Reserves the global skritter namespace if it doesn't already exist.
     * @param skritter
     */
    window.skritter = (function(skritter) {
        return skritter;
    })(window.skritter || {});
    /**
     * @method initialize
     */
    var initialize = function() {
        async.series([
            async.apply(loadApi),
            async.apply(loadAssets),
            async.apply(loadFunctions),
            async.apply(loadModals),
            async.apply(loadParams),
            async.apply(loadSettings),
            async.apply(loadStorage),
            async.apply(loadTimer),
            async.apply(loadUser)
        ], function() {
            Router.initialize();
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
    var loadModals = function(callback) {
        skritter.modals = new Modals().render();
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
     * @method loadSettings
     * @param {Function} callback
     */
    var loadSettings = function(callback) {
        skritter.settings = new Settings();
        callback();
    };
    /**
     * @method loadStorage
     * @param {Function} callback
     */
    var loadStorage = function(callback) {
        if (window.cordova) {
            skritter.storage = new WebSQLAdapter();
        } else {
            skritter.storage = new IndexedDBAdapter();
        }
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
     * @method loadUser
     * @param {Function} callback
     */
    var loadUser = function(callback) {
        skritter.user = new User();
        if (skritter.user.isLoggedIn()) {
            async.series([
                function(callback) {
                    skritter.storage.open(skritter.user.get('user_id'), callback);
                },
                function(callback) {
                    skritter.user.data.sync(callback, false);
                },
                function(callback) {
                    skritter.modals.show('default', function() {
                        skritter.user.data.items.loadSchedule(callback);
                    }).set('.modal-header', false).set('.modal-body', 'LOADING', 'text-center').set('.modal-footer', false);
                },
                function(callback) {
                    skritter.user.data.srsconfigs.loadAll(callback);
                }
            ], function() {
                skritter.modals.hide();
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