/**
 * @module Application
 */
define([
    "framework/GelatoCollection",
    "app/models/data/Item"
], function(GelatoCollection, Item) {
    /**
     * @class DataItems
     * @extend GelatoCollection
     */
    return GelatoCollection.extend({
        /**
         * @property model
         * @type DataItem
         */
        model: Item
    })
});
