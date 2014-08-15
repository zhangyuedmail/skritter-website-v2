/**
 * @module Application
 */
define([
    "framework/GelatoCollection",
    "app/models/data/Sentence"
], function(GelatoCollection, Sentence) {
    /**
     * @class DataSentences
     * @extend GelatoCollection
     */
    return GelatoCollection.extend({
        /**
         * @property model
         * @type DataSentence
         */
        model: Sentence
    });
});
