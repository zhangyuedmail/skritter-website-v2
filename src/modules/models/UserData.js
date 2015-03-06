/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoModel',
    'modules/collections/DataDecomps',
    'modules/collections/DataItems',
    'modules/collections/DataParams',
    'modules/collections/DataStrokes',
    'modules/collections/DataVocabLists',
    'modules/collections/DataVocabs'
], function(GelatoModel, DataDecomps, DataItems, DataParams, DataStrokes, DataVocabLists, DataVocabs) {

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
                }
            ], callback);
        },
        /**
         * @method loadCache
         * @returns {UserData}
         */
        loadCache: function() {
            var item = localStorage.getItem(this.user.getCachePath('data', true));
            if (item) {
                this.set(JSON.parse(item), {silent: true});
            }
            return this;
        }
    });

    return UserData;

});