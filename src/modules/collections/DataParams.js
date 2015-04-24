/**
 * @module Application
 */
define([
    'core/modules/GelatoCollection',
    'modules/models/DataParam',
    'modules/data/Params'
], function(GelatoCollection, DataParam, Params) {

    /**
     * @class DataParams
     * @extends GelatoCollection
     */
    var DataParams = GelatoCollection.extend({
        /**
         * @method initialize
         * @param {Array|Object} [models]
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(models, options) {
            options = options || {};
            this.app = options.app;
            this.add(Params.getParams());
        },
        /**
         * @property model
         * @type DataParam
         */
        model: DataParam
    });

    return DataParams;

});