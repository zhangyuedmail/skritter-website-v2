/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoModel',
    'core/modules/GelatoStorage',
    'modules/collections/DataDecomps',
    'modules/collections/DataItems',
    'modules/collections/DataParams',
    'modules/collections/DataStats',
    'modules/collections/DataStrokes',
    'modules/collections/DataVocabLists',
    'modules/collections/DataVocabs'
], function(
    GelatoModel,
    GelatoStorage,
    DataDecomps,
    DataItems,
    DataParams,
    DataStats,
    DataStrokes,
    DataVocabLists,
    DataVocabs
) {

    /**
     * @class UserData
     * @extends GelatoModel
     */
    var UserData = GelatoModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.decomps = new DataDecomps();
            this.items = new DataItems();
            this.params = new DataParams();
            this.stats = new DataStats();
            this.storage = new GelatoStorage();
            this.strokes = new DataStrokes();
            this.vocablists = new DataVocabLists();
            this.vocabs = new DataVocabs();
            this.on('change', this.cache);
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            lastItemUpdate: 0,
            lastVocabUpdate: 0
        },
        /**
         * @method add
         * @param {Object} result
         * @param {Function} callback
         * @param {Object} [options]
         */
        add: function(result, callback, options) {
            Async.parallel([
                function(callback) {
                    app.user.data.decomps.add(result.Decomps || [], options);
                    callback();
                },
                function(callback) {
                    app.user.data.items.add(result.Items || [], options);
                    callback();
                },
                function(callback) {
                    app.user.data.strokes.add(result.Strokes || [], options);
                    callback();
                },
                function(callback) {
                    app.user.data.vocabs.add(result.Vocabs || [], options);
                    callback();
                }
            ], callback);
        },
        /**
         * @method cache
         * @returns {UserData}
         */
        cache: function() {
            localStorage.setItem(app.user.getDataPath('data', true), JSON.stringify(this.toJSON()));
            return this;
        },
        /**
         * @method initializeStorage
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        initializeStorage: function(callbackSuccess, callbackError) {
            this.storage.open(app.user.getDatabaseName(), 1, {
                decomps: {keyPath: 'writing'},
                items: {keyPath: 'id', index: [{name: 'next'}]},
                reviews: {keyPath: 'id'},
                sentences: {keyPath: 'id'},
                stats: {keyPath: 'date'},
                strokes: {keyPath: 'rune'},
                vocablists: {keyPath: 'id'},
                vocabs: {keyPath: 'id'}
            }, function() {
                callbackSuccess();
            }, function(error) {
                callbackError(error);
            });
        },
        /**
         * @method insert
         * @param {Object} result
         * @param {Function} callback
         */
        insert: function(result, callback) {
            Async.parallel([
                function(callback) {
                    app.user.data.storage.put('decomps', result.Decomps || [], callback, callback);
                },
                function(callback) {
                    app.user.data.storage.put('items', result.Items || [], callback, callback);
                },
                function(callback) {
                    app.user.data.storage.put('strokes', result.Strokes || [], callback, callback);
                },
                function(callback) {
                    app.user.data.storage.put('vocabs', result.Vocabs || [], callback, callback);
                },
                function(callback) {
                    app.user.data.storage.put('vocablists', result.VocabLists || [], callback, callback);
                }
            ], callback);
        },
        /**
         * @method load
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         * @returns {UserData}
         */
        load: function(callbackSuccess, callbackError) {
            var self = this;
            var data = localStorage.getItem(app.user.getDataPath('data', true));
            if (data) {
                this.set(JSON.parse(data), {silent: true});
            }
            Async.series([
                function(callback) {
                    self.initializeStorage(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    self.items.load(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    self.vocablists.load(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    self.stats.load(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                }
            ], function(error) {
                if (error) {
                    if (typeof callbackError === 'function') {
                        callbackError(error);
                    }
                } else {
                    if (typeof callbackSuccess === 'function') {
                        callbackSuccess();
                    }
                }
            });
            return this;
        }
    });

    return UserData;

});