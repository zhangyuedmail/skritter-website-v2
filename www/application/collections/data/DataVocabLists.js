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
         * @property model
         * @type DataVocabList
         */
        model: DataVocabList,
        /**
         * @method getActive
         * @returns {DataVocabLists}
         */
        getActive: function() {
            return new DataVocabLists(this.models.filter(function(list) {
                return ['adding', 'reviewing'].indexOf(list.attributes.studyingMode) !== -1;
            }));
        },
        /**
         * @method loadTable
         */
        getTable: function(el, fields) {
            return new ListTable({el: el}).set(this, fields);
        },
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
