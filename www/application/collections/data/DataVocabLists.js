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
        model: DataVocabList
    });

    return DataVocabLists;
});
