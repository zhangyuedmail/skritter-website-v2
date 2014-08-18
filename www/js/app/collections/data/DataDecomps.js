/**
 * @module Application
 */
define([
    "framework/GelatoCollection",
    "app/models/data/DataDecomp"
], function(GelatoCollection, DataDecomp) {
    /**
     * @class DataDecomps
     * @extend GelatoCollection
     */
    return GelatoCollection.extend({
        /**
         * @property model
         * @type DataDecomp
         */
        model: DataDecomp
    });
});
