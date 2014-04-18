define([
], function() {
    /**
     * @class Schedule
     */
    var Schedule = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.data = [];
        },
        /**
         * @method getDue
         * @param {Boolean} sort
         * @returns {Array}
         */
        getDue: function(sort) {
            if (sort)
                return this.sort().filter(function(item) {
                    return !item.held && item.readiness >= 1;
                });
            return this.schedule.filter(function(item) {
                return !item.held && item.readiness >= 1;
            });
        },
        /**
         * @method getDueCount
         * @param {Boolean} sort
         * @returns {Number}
         */
        getDueCount: function(sort) {
            return this.getDue(sort).length;
        },
        /**
         * @method getNext
         * @returns {Object}
         */
        getNext: function() {
            return this.data[0];
        },
        /**
         * @method load
         * @param {Function} callback
         */
        load: function(callback) {
            var parts = skritter.user.settings.getActiveParts();
            var style = skritter.user.settings.getStyle();
            skritter.storage.getSchedule(parts, style, _.bind(function(schedule) {
                this.data = schedule;
                this.trigger('schedule:loaded');
                callback();
            }, this));
        },
        /**
         * @method sort
         * @returns {Array}
         */
        sort: function() {
            var now = skritter.fn.getUnixTime();
            this.data = _.sortBy(this.data, function(item) {
                if (item.held && item.held > now) {
                    item.readiness = 0.2 + (now / item.held) * 0.1;
                    return -item.readiness;
                } else if (item.held) {
                    delete item.held;
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
            this.trigger('schedule:sorted');
            return this.data;
        },
        /**
         * @method update
         * @param {Backbone.Model} item
         */
        update: function(item) {
            var position = _.findIndex(this.schedule, {id: item.id});
            this.schedule[position] = {
                id: item.id,
                last: item.get('last'),
                next: item.get('next'),
                vocabIds: item.get('vocabIds')
            };
            this.trigger('schedule:updated');
        }
    });
    
    return Schedule;
});