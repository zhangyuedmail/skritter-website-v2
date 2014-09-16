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
            options = options ? options : {};
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
         * @method getActive
         * @param {ScheduleItems}
         */
        getActive: function() {
            var activeParts = this.user.settings.getActiveParts();
            var activeStyles = this.user.settings.getActiveStyles();
            return new ScheduleItems(this.models.filter(function(item) {
                if (!item.attributes.active) {
                    return false;
                }
                if (activeParts.indexOf(item.attributes.part) === -1) {
                    return false;
                }
                if (activeStyles.indexOf(item.attributes.style) === -1) {
                    return false;
                }
                return true;
            }), {user: this.user});
        },
        /**
         * @method getDue
         * @returns {ScheduleItems}
         */
        getDue: function() {
            var now = moment().unix();
            return new ScheduleItems(this.getActive().models.filter(function(item) {
                return item.attributes.next < now;
            }), {user: this.user});
        },
        /**
         * @method getDueCount
         * @returns {Number}
         */
        getDueCount: function() {
            return this.getDue().length;
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
                self.lazyAdd(data, callback);
            });
        }
    });

    return ScheduleItems;
});