/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/data/DataParam'
], function(BaseCollection, DataParam) {
    /**
     * @class DataParams
     * @extend BaseCollection
     */
    var DataParams = BaseCollection.extend({
        /**
         * @property model
         * @type DataParam
         */
        model: DataParam
    });

    return DataParams;
});
