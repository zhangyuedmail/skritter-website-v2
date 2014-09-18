/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/data/DataVocab'
], function(BaseCollection, DataVocab) {
    /**
     * @class DataVocabs
     * @extend BaseCollection
     */
    var DataVocabs = BaseCollection.extend({
        /**
         * @property model
         * @type DataVocab
         */
        model: DataVocab,
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            app.storage.getAll('vocabs', function(data) {
                self.reset();
                self.lazyAdd(data, callback);
            });
        }
    });

    return DataVocabs;
});
