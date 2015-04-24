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
         * @param {Array|Object} [models]
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(models, options) {
            options = options || {};
            this.app = options.app;
        },
        /**
         * @property model
         * @type DataDecomp
         */
        model: DataDecomp
    });

    return DataDecomps;

});