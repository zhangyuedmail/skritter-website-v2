/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/data/DataItem'
], function(BaseCollection, DataItem) {
    /**
     * @class DataItems
     * @extend BaseCollection
     */
    var DataItems = BaseCollection.extend({
        /**
         * @property model
         * @type DataItem
         */
        model: DataItem
    });

    return DataItems;
});