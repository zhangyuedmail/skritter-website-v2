/**
 * @module Application
 */
define([
    'core/modules/GelatoCollection',
    'modules/models/DataParam',
    'modules/data/ParamData'
], function(GelatoCollection, DataParam, ParamData) {

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
            this.add(ParamData.getParams());
        },
        /**
         * @property model
         * @type DataParam
         */
        model: DataParam
    });

    return DataParams;

});