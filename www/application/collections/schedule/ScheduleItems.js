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
         * @method initialize
         * @param {User} user
         * @constructor
         */
        initialize: function(attributes, options) {
            this.user = options.user;
        },
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
         * @param {Number} [index]
         * @returns {DataItem}
         */
        getNext: function(index) {
            var activeParts = this.user.settings.getActiveParts();
            var activeStyles = this.user.settings.getActiveStyles();
            index = index ? index : 0;
            for (var i = 0, length = this.length; i < length; i++) {
                var item = this.at(i);
                if (!item.attributes.active) {
                    continue;
                }
                if (activeParts.indexOf(item.attributes.part) === -1) {
                    continue;
                }
                if (activeStyles.indexOf(item.attributes.style) === -1) {
                    continue;
                }
                if (index > 0) {
                    index--;
                    continue;
                }
                return item;
            }
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