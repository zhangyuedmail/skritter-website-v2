/**
 * @module Application
 */
define([
    "framework/GelatoCollection",
    "app/models/data/DataSentence"
], function(GelatoCollection, DataSentence) {
    /**
     * @class DataSentences
     * @extend GelatoCollection
     */
    return GelatoCollection.extend({
        /**
         * @property model
         * @type DataSentence
         */
        model: DataSentence
    });
});
