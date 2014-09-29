/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/data/DataVocabList',
    'components/ListTable'
], function(BaseCollection, DataVocabList, ListTable) {
    /**
     * @class DataVocabLists
     * @extend BaseCollection
     */
    var DataVocabLists = BaseCollection.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.on('add change', function(vocablist) {
                vocablist.cache();
            });
        },
        /**
         * @property model
         * @type DataVocabList
         */
        model: DataVocabList,
        /**
         * @method cache
         * @param {Function} [callback]
         */
        cache: function(callback) {
            app.storage.putItems('vocablists', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method getActive
         * @returns {DataVocabLists}
         */
        getActive: function() {
            return this.models.filter(function(list) {
                return ['adding', 'reviewing'].indexOf(list.attributes.studyingMode) !== -1;
            });
        },
        /**
         * @method getAdding
         * @returns {DataVocabLists}
         */
        getAdding: function() {
            return this.models.filter(function(list) {
                return ['adding'].indexOf(list.attributes.studyingMode) !== -1;
            });
        },
        /**
         * @method getTable
         */
        getTable: function() {
            return new ListTable(null, this);
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            app.storage.getAll('vocablists', function(data) {
                self.reset();
                self.lazyAdd(data, callback, {silent: true});
            });
        }
    });

    return DataVocabLists;
});
