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
         * @constructor
         */
        initialize: function() {
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