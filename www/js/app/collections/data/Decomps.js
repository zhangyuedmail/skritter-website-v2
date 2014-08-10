/**
 * @module Application
 */
define([
    "framework/GelatoCollection",
    "app/models/data/Decomp"
], function(GelatoCollection, Decomp) {
    /**
     * @class DataDecomps
     * @extend GelatoCollection
     */
    return GelatoCollection.extend({
        /**
         * @property model
         * @type DataDecomp
         */
        model: Decomp
    })
});
