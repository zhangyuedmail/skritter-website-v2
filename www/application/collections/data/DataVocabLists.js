/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/data/DataVocabList'
], function(BaseCollection, DataVocabList) {
    /**
     * @class DataVocabLists
     * @extend BaseCollection
     */
    var DataVocabLists = BaseCollection.extend({
        /**
         * @property model
         * @type DataVocabList
         */
        model: DataVocabList,
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            app.storage.getAll('vocablists', function(data) {
                self.reset();
                self.lazyAdd(data, callback);
            });
        }
    });

    return DataVocabLists;
});
