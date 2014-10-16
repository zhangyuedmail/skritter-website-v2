/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/user/ScheduleItem'
], function(BaseCollection, ScheduleItem) {
    /**
     * @class ScheduleItems
     * @extend BaseCollection
     */
    var ScheduleItems = BaseCollection.extend({
        /**
         * @method initialize
         * @param {Array} models
         * @param {Object} options
         * @constructor
         */
        initialize: function(models, options) {
            options = options ? options : {};
            this.user = options.user;
            this.filtered = [];
            this.recent = [];
        },
        /**
         * @property model
         * @type ScheduleItem
         */
        model: ScheduleItem,
        /**
         * @method addRecent
         * @param {String} base
         * @returns {Array}
         */
        addRecent: function(base) {
            if (this.recent.indexOf(base) === -1) {
                this.recent.unshift(base);
                if (this.recent.length > 9) {
                    this.recent.pop();
                }
            }
            return this.recent;
        },
        /**
         * @method getDue
         * @returns {Array}
         */
        getDue: function() {
            var now = moment().add(5, 'minutes').unix();
            return this.filtered.filter(function(item) {
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
         * @method getNext
         * @param {Number} [index]
         * @returns {DataItem}
         */
        getNext: function(index) {
            var items = this.sortFilter();
            index = index ? index : 0;
            for (var i = 0, length = items.length; i < length; i++) {
                var item = items[i];

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
            options.merge = options.merge === undefined ? true : options.merge;
            options.silent = options.silent === undefined ? false : options.silent;
            options.sort = options.sort === undefined ? true : options.sort;
            var scheduleItems = [];
            for (var i = 0, length = items.length; i < length; i++) {
                var item = items[i];
                scheduleItems.push({
                    id: item.id,
                    interval: item.interval || 0,
                    last: item.last || 0,
                    next: item.next || 0,
                    part: item.part,
                    reviews: item.reviews,
                    sectionIds: item.sectionIds,
                    style: item.style,
                    successes: item.successes,
                    vocabIds: item.vocabIds,
                    vocabListIds: item.vocabListIds
                });
            }
            console.log('UPDATING SCHEDULE:', scheduleItems);
            return this.add(scheduleItems, options);
        },
        /**
         * @method isFiltered
         * @returns {Boolean}
         */
        isFiltered: function() {
            return this.filtered.length < this.length;
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
        },
        /**
         * @method logSchedule
         * @param {Number} [limit]
         */
        logSchedule: function(limit) {
            limit = limit || 10;
            var items = this.sortFilter();
            for (var i = 0, length = limit || items.length; i < length; i++) {
                var item = items[i];
                if (item) {
                    console.log(item.id, item.getReadiness(this.sorted));
                } else {
                    break;
                }
            }
        },
        /**
         * @method sortFilter
         * @returns {Array}
         */
        sortFilter: function() {
            var now = moment().unix();
            this.filtered = _.sortBy(this.filtered, function(item) {
                return -item.getReadiness(now, this.recent);
            });
            this.trigger('sort', this);
            return this.filtered;
        },
        /**
         * @method updateFilter
         * @returns {ScheduleItems}
         */
        updateFilter: function() {
            var activeLists = this.user.settings.getActiveLists();
            var activeParts = this.user.settings.getActiveParts();
            var activeStyles = this.user.settings.getActiveStyles();
            this.filtered = this.filter(function(item) {
                if (!item.attributes.vocabIds.length) {
                    return false;
                }
                if (activeParts.indexOf(item.attributes.part) === -1) {
                    return false;
                }
                if (activeStyles.indexOf(item.attributes.style) === -1) {
                    return false;
                }
                if (activeLists) {
                    for (var i = 0, length = activeLists.length; i < length; i++) {
                        if (item.attributes.vocabListIds.indexOf(activeLists[i]) !== -1) {
                            return true;
                        }
                    }
                    return false;
                }
                if (app.user.isJapanese()) {
                    var itemBase = item.id.split('-')[2];
                    if (item.equals('part', 'rdng') && app.fn.isKana(itemBase)) {
                        item.set('vocabIds', []);
                        return false;
                    }
                }
                return true;
            });
            this.trigger('sort', this);
            return this;
        }
    });

    return ScheduleItems;
});