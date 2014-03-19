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
            this.schedule = [];
            this.on('change', function(item) {
                item.cache();
            });
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Item,
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
         * @method loadSchedule
         * @param {Function} callback
         */
        loadSchedule: function(callback) {
            skritter.storage.getSchedule(_.bind(function(schedule) {
                this.schedule = schedule;
                callback();
            }, this));
        },
        /**
         * @method next
         * @param {Function} callback
         * @param {Array|String} filterParts
         * @param {Array|String} filterIds
         * @returns {Backbone.Model}
         */
        next: function(callback, filterParts, filterIds) {
            var schedule = this.sort();
            var i = 0;
            if (filterParts) {
                filterParts = Array.isArray(filterParts) ? filterParts : [filterParts];
                for (var length = schedule.length; i < length; i++)
                    if (filterParts.indexOf(schedule[i].id.split('-')[4]) > -1)
                        break;
            }
            if (filterIds) {
                filterIds = Array.isArray(filterIds) ? filterIds : [filterIds];
                schedule = schedule.filter(function(item) {
                    return filterIds.indexOf(item.id) > -1;
                });
            }
            skritter.user.data.loadItem(schedule[i].id, function(item) {
                callback(item);
            });
        },
        /**
         * @method sort
         * @returns {Array}
         */
        sort: function() {
            var now = skritter.fn.getUnixTime();
            this.schedule = _.sortBy(this.schedule, function(item) {
                if (item.held && item.held > now) {
                    item.readiness = 0.5 + (now / item.held) * 0.1;
                    return -item.readiness;
                }
                if (!item.last && (item.next - now) > 600) {
                    item.readiness = 0.2;
                    return -item.readiness;
                }
                if (!item.last || (item.next - item.last) === 1) {
                    item.readiness = 99999999;
                    return -item.readiness;
                }
                var seenAgo = now - item.last;
                var rtd = item.next - item.last;
                var readiness = seenAgo / rtd;
                if (readiness > 0 && seenAgo > 9000) {
                    var dayBonus = 1;
                    var ageBonus = 0.1 * Math.log(dayBonus + (dayBonus * dayBonus * seenAgo) * skritter.fn.daysInSecond);
                    var readiness2 = (readiness > 1) ? 0.0 : 1 - readiness;
                    ageBonus *= readiness2 * readiness2;
                    readiness += ageBonus;
                }
                item.readiness = readiness;
                return -item.readiness;
            });
            return this.schedule;
        }
    });

    return Items;
});