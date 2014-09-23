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
         * @param {Array} models
         * @param {User} user
         * @constructor
         */
        initialize: function(models, options) {
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
         * @param {Array}
         */
        getActive: function() {
            var activeParts = this.user.settings.getActiveParts();
            var activeStyles = this.user.settings.getActiveStyles();
            return this.models.filter(function(item) {
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
            });
        },
        /**
         * @method getActiveCount
         * @param {Number}
         */
        getActiveCount: function() {
            return this.getActive().length;
        },
        /**
         * @method getDue
         * @returns {Array}
         */
        getDue: function() {
            var now = moment().add(1, 'minutes').unix();
            return this.getActive().filter(function(item) {
                return item.attributes.next < now;
            });
        },
        /**
         * @method getDueCount
         * @returns {Number}
         */
        getDueCount: function() {
            return this.getDue().length;
        },
        /**
         * @method getNew
         * @returns {ScheduleItems}
         */
        getNew: function() {
            return this.getActive().filter(function(item) {
                return item.isNew();
            });
        },
        /**
         * @method getNewCount
         * @returns {Number}
         */
        getNewCount: function() {
            return this.getNew().length;
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

            return this.get('mcfarljwtest2-zh-天天向上-0-tone');

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
         * @method insert
         * @param {Array|Object} items
         * @param {Object} [options]
         */
        insert: function(items, options) {
            items = Array.isArray(items) ? items : [items];
            options = options ? options : {};
            options.merge = options.merge ? options.merge : true;
            options.silent = options.silent ? options.silent : true;
            options.sort = options.sort ? options.sort : false;
            var scheduleItems = [];
            for (var i = 0, length = items.length; i < length; i++) {
                var item = items[i];
                scheduleItems.push({
                    active: item.vocabIds.length ? true : false,
                    id: item.id,
                    interval: item.interval ? item.interval : 0,
                    last: item.last ? item.last : 0,
                    next: item.next ? item.next : 0,
                    part: item.part,
                    reviews: item.reviews ? item.reviews : 0,
                    style: item.style,
                    successes: item.successes ? item.successes : 0
                });
            }
            return this.add(scheduleItems, options);
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            app.storage.getSchedule(function(data) {
                self.reset();
                self.lazyAdd(data, callback, {silent: true});
            });
        }
    });

    return ScheduleItems;
});