/**
 * @module Application
 */
define([
    "framework/GelatoCollection",
    "app/models/data/Vocab"
], function(GelatoCollection, Vocab) {
    /**
     * @class DataVocabs
     * @extend GelatoCollection
     */
    return GelatoCollection.extend({
        /**
         * @property model
         * @type DataVocab
         */
        model: Vocab
    });
});
