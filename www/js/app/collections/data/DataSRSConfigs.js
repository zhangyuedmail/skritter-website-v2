/**
 * @module Application
 */
define([
    "framework/GelatoCollection",
    "app/models/data/DataSRSConfig"
], function(GelatoCollection, DataSRSConfig) {
    /**
     * @class DataSRSConfigs
     * @extend GelatoCollection
     */
    return GelatoCollection.extend({
        /**
         * @property model
         * @type DataSRSConfig
         */
        model: DataSRSConfig
    });
});
