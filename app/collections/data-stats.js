var GelatoCollection = require('gelato/collection');
var DataStat = require('models/data-stat');

/**
 * @class DataStats
 * @extends {GelatoCollection}
 */
module.exports = GelatoCollection.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {},
    /**
     * @property model
     * @type {DataStat}
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
        var momentMonthStart = moment().subtract(4, 'hours').startOf('month');
        var momentMonthEnd = moment().subtract(4, 'hours').endOf('month');
        async.parallel([
            function(callback) {
                app.api.fetchStats({
                    start: moment(momentMonthEnd).subtract('11', 'days').format('YYYY-MM-DD'),
                    end: moment(momentMonthEnd).format('YYYY-MM-DD')
                }, function(result) {
                    self.add(result, {merge: true});
                    self.trigger('fetch', self);
                    callback();
                }, function(error) {
                    callback(error);
                });
            },
            function(callback) {
                app.api.fetchStats({
                    start: moment(momentMonthEnd).subtract('23', 'days').format('YYYY-MM-DD'),
                    end: moment(momentMonthEnd).subtract('12', 'days').format('YYYY-MM-DD')
                }, function(result) {
                    self.add(result, {merge: true});
                    self.trigger('fetch', self);
                    callback();
                }, function(error) {
                    callback(error);
                });
            },
            function(callback) {
                app.api.fetchStats({
                    start: moment(momentMonthStart).format('YYYY-MM-DD'),
                    end: moment(momentMonthEnd).subtract('24', 'days').format('YYYY-MM-DD')
                }, function(result) {
                    self.add(result, {merge: true});
                    self.trigger('fetch', self);
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
                if (typeof callbackSuccess === 'function') {
                    callbackSuccess();
                }
            }
        });
    },
    /**
     * @method getAllTimeCharactersLearned
     * @returns {Number}
     */
    getAllTimeCharactersLearned: function() {
        return this.length ? this.at(0).get('char').rune.learned.all : 0;
    },
    /**
     * @method getAllTimeWordsLearned
     * @returns {Number}
     */
    getAllTimeWordsLearned: function() {
        return this.length ? this.at(0).get('word').rune.learned.all : 0;
    },
    /**
     * @method getDailyItemsReviewed
     * @returns {Number}
     */
    getDailyItemsReviewed: function() {
        var total = 0;
        var today = moment().subtract(4, 'hours').format('YYYY-MM-DD');
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
        var today = moment().subtract(4, 'hours').format('YYYY-MM-DD');
        var stat = this.get(today);
        return stat ? stat.get('timeStudied').day : 0;
    },
    /**
     * @method getGoalItemPercent
     * @returns {Number}
     */
    getGoalItemPercent: function() {
        var goal = app.user.settings.getGoal();
        var totalItems = app.user.data.stats.getDailyItemsReviewed();
        var percentItems = Math.round(totalItems / goal.value * 100);
        return percentItems > 100 ? 100 : parseFloat(percentItems.toFixed(2));
    },
    /**
     * @method getGoalTimePercent
     * @returns {Number}
     */
    getGoalTimePercent: function() {
        var goal = app.user.settings.getGoal();
        var totalTime = app.user.data.stats.getDailyTimeStudied() / 60;
        var percentTime = Math.round(totalTime / goal.value * 100);
        return percentTime > 100 ? 100 : parseFloat(percentTime.toFixed(2));
    },
    /**
     * @method getMonthlyHeatmapData
     * @returns {Object}
     */
    getMonthlyHeatmapData: function() {
        var data = {};
        for (var i = 0, length = this.length; i < length; i++) {
            var stat = this.at(i);
            var date = moment(stat.get('date')).unix();
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
     * @method getMonthlyStreak
     * @returns {Number}
     */
    getMonthlyStreak: function() {
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
    }
});
