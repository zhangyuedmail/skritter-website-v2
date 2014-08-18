/**
 * @module Application
 */
define([
    "framework/GelatoCollection",
    "app/models/data/DataStroke"
], function(GelatoCollection, DataStroke) {
    /**
     * @class DataStrokes
     * @extend GelatoCollection
     */
    return GelatoCollection.extend({
        /**
         * @property model
         * @type DataStroke
         */
        model: DataStroke
    });
});
