/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/schedule/ScheduleItem'
], function(BaseCollection, ScheduleItem) {
    /**
     * @class ScheduleItems
     * @extend BaseCollection
     */
    var ScheduleItems = BaseCollection.extend({
        /**
         * @property model
         * @type ScheduleItem
         */
        model: ScheduleItem,
        /**
         * @method comparator
         * @param {ScheduleItem} item
         * @returns {Number}
         */
        comparator: function(item) {
            return item.attributes.next;
        },
        /**
         * @method getNext
         * @returns {DataItem}
         */
        getNext: function() {
            var next = undefined;
            for (var i = 0, length = this.length; i < length; i++) {



            }
            return next;
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            app.storage.getSchedule(function(data) {
                self.reset();
                self.add(data);
                callback();
            });
        }
    });

    return ScheduleItems;
});