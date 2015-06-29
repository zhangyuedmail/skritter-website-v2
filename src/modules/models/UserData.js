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
    'modules/collections/DataSentences',
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
    DataSentences,
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
            this.sentences = new DataSentences();
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
            lastErrorCheck: 0,
            lastItemUpdate: 0,
            lastVocabUpdate: 0
        },
        /**
         * @method add
         * @param {Object} result
         * @param {Object} [options]
         * @param {Function} [callback]
         */
        add: function(result, options, callback) {
            Async.parallel([
                function(callback) {
                    app.user.data.decomps.add(result.Decomps || [], options);
                    callback();
                },
                function(callback) {
                    app.user.data.items.add(result.ContainedItems || [], options);
                    callback();
                },
                function(callback) {
                    app.user.data.items.add(result.Items || [], options);
                    callback();
                },
                function(callback) {
                    app.user.data.sentences.add(result.Sentences || [], options);
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
                    app.user.data.storage.put('items', result.ContainedItems || [], callback, callback);
                },
                function(callback) {
                    app.user.data.storage.put('items', result.Items || [], callback, callback);
                },
                function(callback) {
                    app.user.data.storage.put('sentences', result.Sentences || [], callback, callback);
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
        }
    });

    return UserData;

});