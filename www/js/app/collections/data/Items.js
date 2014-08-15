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
    var DataItems = GelatoCollection.extend({
        /**
         * @property model
         * @type DataItem
         */
        model: Item,
        /**
         * @method comparator
         * @param {DataItem} item
         * @returns {Number}
         */
        comparator: function(item) {
            return -(item.attributes.last + item.attributes.interval);
        },
        /**
         * @method getDue
         * @returns {DataItems}
         */
        getDue: function() {
            var now = moment().unix();
            return new DataItems(this.filter(function(item) {
                if (!item.attributes.vocabIds.length ||
                    app.user.settings.getActiveParts().indexOf(item.attributes.part) === -1 ||
                    app.user.settings.getActiveStyles().indexOf(item.attributes.style) === -1) {
                    return false;
                }
                return item.attributes.last + item.attributes.interval < now;
            }));
        },
        /**
         * @method getDueCount
         * @returns {Number}
         */
        getDueCount: function() {
            return this.getDue().length;
        }
    });

    return DataItems;
});