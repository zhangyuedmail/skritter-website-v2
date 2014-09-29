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
         * @method initialize
         */
        initialize: function() {
            this.on('change', function(vocab) {
                vocab.cache();
            });
        },
        /**
         * @property model
         * @type DataVocab
         */
        model: DataVocab,
        /**
         * @method cache
         * @param {Function} [callback]
         */
        cache: function(callback) {
            app.storage.putItems('vocabs', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
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
