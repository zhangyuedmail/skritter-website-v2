/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoCollection',
    'modules/models/DataStat'
], function(
    GelatoCollection,
    DataStat
) {

    /**
     * @class DataStats
     * @extends GelatoCollection
     */
    var DataStats = GelatoCollection.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property model
         * @type DataStat
         */
        model: DataStat,
        /**
         * @method comparator
         * @param {DataStat} statA
         * @param {DataStat} statB
         * @returns {Number}
         */
        comparator: function(statA, statB) {
            if (statA.id > statB.id) {
                return -1;
            } else if (statB.id > statA.id) {
                return 1;
            } else {
                return 0;
            }
        },
        /**
         * @method fetch
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        fetch: function(callbackSuccess, callbackError) {
            var self = this;
            var momentMonthStart = Moment().startOf('month');
            var momentMonthEnd = Moment().endOf('month');
            Async.series([
                function(callback) {
                    app.api.fetchStats({
                        start: Moment(momentMonthEnd).subtract('11', 'days').format('YYYY-MM-DD'),
                        end: Moment(momentMonthEnd).format('YYYY-MM-DD')
                    }, function(result) {
                        self.add(result, {merge: true});
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    app.api.fetchStats({
                        start: Moment(momentMonthEnd).subtract('23', 'days').format('YYYY-MM-DD'),
                        end: Moment(momentMonthEnd).subtract('12', 'days').format('YYYY-MM-DD')
                    }, function(result) {
                        self.add(result, {merge: true});
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    app.api.fetchStats({
                        start: Moment(momentMonthStart).format('YYYY-MM-DD'),
                        end: Moment(momentMonthEnd).subtract('24', 'days').format('YYYY-MM-DD')
                    }, function(result) {
                        self.add(result, {merge: true});
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                }
            ], function(error) {
                if (error) {
                    if (typeof callbackError === 'function') {
                        callbackError(error);
                    }
                } else {
                    self.trigger('update', self);
                    if (typeof callbackSuccess === 'function') {
                        callbackSuccess();
                    }
                }
            });
        },
        /**
         * @method getDailyItemsReviewed
         * @returns {Number}
         */
        getDailyItemsReviewed: function() {
            var total = 0;
            var today = Moment().format('YYYY-MM-DD');
            var stat = this.get(today);
            if (stat) {
                total += stat.get('char').defn.studied.day;
                total += stat.get('char').rdng.studied.day;
                total += stat.get('char').rune.studied.day;
                total += stat.get('char').tone.studied.day;
                total += stat.get('word').defn.studied.day;
                total += stat.get('word').rdng.studied.day;
                total += stat.get('word').rune.studied.day;
                total += stat.get('word').tone.studied.day;
            }
            return total;
        },
        /**
         * @method getDailyTimeStudied
         * @returns {Number}
         */
        getDailyTimeStudied: function() {
            var today = Moment().format('YYYY-MM-DD');
            var stat = this.get(today);
            return stat ? stat.get('timeStudied').day : 0;
        },
        /**
         * @method getGoalItemData
         * @returns {Array}
         */
        getGoalItemData: function() {
            var goal = app.user.settings.getGoal();
            var remainingItems = goal.value - this.getDailyItemsReviewed() || 0;
            return [
                {label: "Completed", value: goal.value - remainingItems, color:'#c5da4b'},
                {label: "Remaining", value: remainingItems, color: '#efeef3'}
            ];
        },
        /**
         * @method getGoalItemPercent
         * @returns {Number}
         */
        getGoalItemPercent: function() {
            var data = this.getGoalItemData();
            var total = data[0].value + data[1].value;
            return Math.round(data[0].value / total * 100);
        },
        /**
         * @method getGoalTimeData
         * @returns {Array}
         */
        getGoalTimeData: function() {
            var goal = app.user.settings.getGoal();
            var remainingTime = goal.value - (app.user.data.stats.getDailyTimeStudied() / 60) || 0;
            return [
                {label: "Completed", value: (goal.value - remainingTime).toFixed(2), color:'#c5da4b'},
                {label: "Remaining", value: remainingTime.toFixed(2), color: '#efeef3'}
            ];
        },
        /**
         * @method getGoalTimePercent
         * @returns {Number}
         */
        getGoalTimePercent: function() {
            var data = this.getGoalTimeData();
            var total = data[0].value + data[1].value;
            return Math.round(data[0].value / total * 100);
        },
        /**
         * @method getHeatmapData
         * @returns {Object}
         */
        getHeatmapData: function() {
            var data = {};
            for (var i = 0, length = this.length; i < length; i++) {
                var stat = this.at(i);
                var date = Moment(stat.get('date')).unix();
                data[date] = 0;
                data[date] += stat.get('char').defn.studied.day;
                data[date] += stat.get('char').rdng.studied.day;
                data[date] += stat.get('char').rune.studied.day;
                data[date] += stat.get('char').tone.studied.day;
                data[date] += stat.get('word').defn.studied.day;
                data[date] += stat.get('word').rdng.studied.day;
                data[date] += stat.get('word').rune.studied.day;
                data[date] += stat.get('word').tone.studied.day;
            }
            return data;
        },
        /**
         * @method getStreak
         * @returns {Number}
         */
        getStreak: function() {
            var bestStreak = 0;
            var currentStreak = 0;
            var timeStudied = this.pluck('timeStudied');
            for (var i = 0, length = timeStudied.length; i < length; i++) {
                if (timeStudied[i].day !== 0) {
                    currentStreak++;
                }
                if (currentStreak > bestStreak) {
                    bestStreak = currentStreak;
                }
                if (timeStudied[i].day === 0) {
                    currentStreak = 0;
                }
            }
            return bestStreak;
        },
        /**
         * @method getTotalCharactersLearned
         * @returns {Number}
         */
        getTotalCharactersLearned: function() {
            return this.length ? this.at(0).get('char').rune.learned.all : 0;
        },
        /**
         * @method getTotalWordsLearned
         * @returns {Number}
         */
        getTotalWordsLearned: function() {
            return this.length ? this.at(0).get('word').rune.learned.all : 0;
        }
    });

    return DataStats;

});