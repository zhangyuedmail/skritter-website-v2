/**
 * @module Application
 */
define([
    "framework/GelatoCollection",
    "app/models/data/Stroke"
], function(GelatoCollection, Stroke) {
    /**
     * @class DataStrokes
     * @extend GelatoCollection
     */
    return GelatoCollection.extend({
        /**
         * @property model
         * @type DataStroke
         */
        model: Stroke
    })
});
