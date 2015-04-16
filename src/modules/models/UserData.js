/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoModel',
    'modules/collections/DataDecomps',
    'modules/collections/DataItems',
    'modules/collections/DataParams',
    'modules/collections/DataStats',
    'modules/collections/DataStrokes',
    'modules/collections/DataVocabLists',
    'modules/collections/DataVocabs'
], function(GelatoModel, DataDecomps, DataItems, DataParams, DataStats, DataStrokes, DataVocabLists, DataVocabs) {

    /**
     * @class UserData
     * @extends GelatoModel
     */
    var UserData = GelatoModel.extend({
        /**
         * @method initialize
         * @param {Object} [attributes]
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(attributes, options) {
            options = options || {};
            this.decomps = new DataDecomps();
            this.items = new DataItems();
            this.params = new DataParams();
            this.stats = new DataStats();
            this.strokes = new DataStrokes();
            this.user = options.user;
            this.vocablists = new DataVocabLists();
            this.vocabs = new DataVocabs();
            this.on('change', this.cache);
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {},
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
            localStorage.setItem(this.user.getCachePath('data', true), JSON.stringify(this.toJSON()));
            return this;
        },
        /**
         * @method insert
         * @param {Object} result
         * @param {Function} callback
         */
        insert: function(result, callback) {
            Async.parallel([
                function(callback) {
                    app.user.storage.put('decomps', result.Decomps || [], callback, callback);
                },
                function(callback) {
                    app.user.storage.put('items', result.Items || [], callback, callback);
                },
                function(callback) {
                    app.user.storage.put('strokes', result.Strokes || [], callback, callback);
                },
                function(callback) {
                    app.user.storage.put('vocabs', result.Vocabs || [], callback, callback);
                },
                function(callback) {
                    app.user.storage.put('vocablists', result.VocabLists || [], callback, callback);
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
            Async.series([
                function(callback) {
                    var cachedItem = localStorage.getItem(self.user.getCachePath('data', true));
                    if (cachedItem) {
                        self.set(JSON.parse(cachedItem), {silent: true});
                    }
                    callback();
                },
                function(callback) {
                    self.items.load(function() {
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
                },
                function(callback) {
                    self.vocablists.load(function() {
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