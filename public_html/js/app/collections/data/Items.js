/**
 * @module Skritter
 * @submodule Collections
 * @param Item
 * @author Joshua McFarland
 */
define([
    'models/data/Item'
], function(Item) {
    /**
     * @class DataItems
     */
    var Items = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Items.daysInSecond = 1 / 86400;
            Items.sortStarted = 0;
            this.on('change', function(item) {
                item.cache();
            });
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Item,
        /**
         * @method item
         * @param {Backbone.Model} item
         * @returns {undefined}
         */
        comparator: function(item) {
            var held = item.get('held');
            if (held && held > Items.sortStarted) {
                item.readiness = 0.5 + (Items.sortStarted / item.held) * 0.1;
                return -item.readiness;
            }
            var last = item.get('last');
            var next = item.get('next');
            if (!last && (next - Items.sortStarted) > 600) {
                item.readiness = 0.2;
                return -item.readiness;
            }
            if (!last || (next - last) === 1) {
                item.readiness = 99999999;
                return -item.readiness;
            }
            var seenAgo = Items.sortStarted - last;
            var rtd = next - last;
            var readiness = seenAgo / rtd;
            if (readiness > 0 && seenAgo > 9000) {
                var dayBonus = 1;
                var ageBonus = 0.1 * Math.log(dayBonus + (dayBonus * dayBonus * seenAgo) * Items.daysInSecond);
                var readiness2 = (readiness > 1) ? 0.0 : 1 - readiness;
                ageBonus *= readiness2 * readiness2;
                readiness += ageBonus;
            }
            item.readiness = readiness;
            return -item.readiness;
        },
        /**
         * @method insert
         * @param {Array} items
         * @param {Function} callback
         */
        insert: function(items, callback) {
            var self = this;
            skritter.storage.put('items', items, function() {
                self.add(items, {merge: true, silent: true, sort: false});
                callback();
            });
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            skritter.storage.getAll('items', function(items) {
                self.add(items, {merge: true, silent: true, sort: false});
                callback();
            });
        },
        /**
         * @method sort
         * @param {Object} options
         * @returns {Backbone.Collection}
         */
        sort: function(options) {
            Items.sortStarted = skritter.fn.getUnixTime();
            return Backbone.Collection.prototype.sort.apply(this, options);
        }
    });

    return Items;
});