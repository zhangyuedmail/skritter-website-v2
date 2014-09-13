/**
 * @module Application
 */
define([
    "framework/GelatoCollection",
    "app/models/data/DataVocab"
], function(GelatoCollection, DataVocab) {
    /**
     * @class DataVocabs
     * @extend GelatoCollection
     */
    return GelatoCollection.extend({
        /**
         * @property model
         * @type DataVocab
         */
        model: DataVocab
    });
});
