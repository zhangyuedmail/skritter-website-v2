/**
 * @module Application
 */
define([
    'core/modules/GelatoCollection',
    'modules/models/DataDecomp'
], function(GelatoCollection, DataDecomp) {

    /**
     * @class DataDecomps
     * @extend BaseCollection
     */
    var DataDecomps = GelatoCollection.extend({
        /**
         * @property model
         * @type DataDecomp
         */
        model: DataDecomp
    });

    return DataDecomps;

});