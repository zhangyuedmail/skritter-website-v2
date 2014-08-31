/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/data/DataSRSConfig'
], function(BaseCollection, DataSRSConfig) {
    /**
     * @class DataSRSConfigs
     * @extend BaseCollection
     */
    var DataSRSConfigs = BaseCollection.extend({
        /**
         * @property model
         * @type DataSRSConfig
         */
        model: DataSRSConfig
    });

    return DataSRSConfigs;
});
