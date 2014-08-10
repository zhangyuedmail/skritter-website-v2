/**
 * @module Application
 */
define([
    "framework/GelatoCollection",
    "app/models/data/VocabList"
], function(GelatoCollection, VocabList) {
    /**
     * @class DataVocabLists
     * @extend GelatoCollection
     */
    return GelatoCollection.extend({
        /**
         * @property model
         * @type DataVocabList
         */
        model: VocabList
    })
});
