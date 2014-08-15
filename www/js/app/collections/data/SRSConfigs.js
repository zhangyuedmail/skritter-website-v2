/**
 * @module Application
 */
define([
    "framework/GelatoCollection",
    "app/models/data/SRSConfig"
], function(GelatoCollection, SRSConfig) {
    /**
     * @class DataSRSConfigs
     * @extend GelatoCollection
     */
    return GelatoCollection.extend({
        /**
         * @property model
         * @type DataSRSConfig
         */
        model: SRSConfig
    });
});
