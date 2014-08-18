/**
 * @module Application
 */
define([
    "framework/GelatoCollection",
    "app/models/data/DataVocabList"
], function(GelatoCollection, DataVocabList) {
    /**
     * @class DataVocabLists
     * @extend GelatoCollection
     */
    return GelatoCollection.extend({
        /**
         * @property model
         * @type DataVocabList
         */
        model: DataVocabList
    });
});
