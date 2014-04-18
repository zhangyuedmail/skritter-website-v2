/**
 * @module Skritter
 * @author Joshua McFarland
 */
define([
    'model/Api',
    'Functions',
    'model/storage/IndexedDBAdapter',
    'view/component/Modal',
    'Router',
    'model/Settings',
    'model/User'
], function(Api, Functions, IndexedDBAdapter, Modal, Router, Settings, User) {
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
            async.apply(loadFunctions),
            async.apply(loadModal),
            async.apply(loadSettings),
            async.apply(loadStorage),
            async.apply(loadUser),
            async.apply(loadRouter)
        ], function() {
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
                }
            ], callback);
        } else {
            callback();
        }
    };

    return {
        initialize: initialize
    };
});