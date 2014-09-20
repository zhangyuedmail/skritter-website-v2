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
        model: DataSRSConfig,
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            app.storage.getAll('srsconfigs', function(data) {
                self.reset();
                self.lazyAdd(data, callback);
            });
        }
    });

    return DataSRSConfigs;
});
