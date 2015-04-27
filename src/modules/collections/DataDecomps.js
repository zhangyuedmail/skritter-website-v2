/**
 * @module Application
 */
define([
    'core/modules/GelatoCollection',
    'modules/models/DataDecomp'
], function(GelatoCollection, DataDecomp) {

    /**
     * @class DataDecomps
     * @extends BaseCollection
     */
    var DataDecomps = GelatoCollection.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property model
         * @type DataDecomp
         */
        model: DataDecomp
    });

    return DataDecomps;

});