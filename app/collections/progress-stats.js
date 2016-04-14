var SkritterCollection = require('base/skritter-collection');
var ProgressStat = require('models/progress-stat');

/**
 * @class ProgressStats
 * @extends {SkritterCollection}
 */
module.exports = SkritterCollection.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
  },
  /**
   * @property model
   * @type {ProgressStat}
   */
  model: ProgressStat,
  /**
   * @property url
   * @type {String}
   */
  url: 'progstats',
  /**
   * @method comparator
   * @param {ProgressStats} statA
   * @param {ProgressStats} statB
   * @returns {Number}
   */
  comparator: function(statA, statB) {
    if (statA.id > statB.id) {
      return 1;
    } else if (statB.id > statA.id) {
      return -1;
    } else {
      return 0;
    }
  },
  /**
   * @method parse
   * @param {Object} response
   * @returns Array
   */
  parse: function(response) {
    return response.ProgressStats;
  },
  /**
   * @method fetchMonth
   * @param {Function} [callbackSuccess]
   * @param {Function} [callbackError]
   */
  fetchMonth: function(callbackSuccess, callbackError) {
    var momentMonthStart = moment().subtract(4, 'hours').startOf('month');
    var momentMonthEnd = moment().subtract(4, 'hours').endOf('month');
    async.series([
      _.bind(function(callback) {
        this.fetch({
          data: {
            start: moment(momentMonthEnd).subtract('11', 'days').format('YYYY-MM-DD'),
            end: moment(momentMonthEnd).format('YYYY-MM-DD')
          },
          remove: false,
          success: function() {
            callback();
          },
          error: function(model, error) {
            callback(error, model);
          }
        });
      }, this),
      _.bind(function(callback) {
        this.fetch({
          data: {
            start: moment(momentMonthEnd).subtract('23', 'days').format('YYYY-MM-DD'),
            end: moment(momentMonthEnd).subtract('12', 'days').format('YYYY-MM-DD')
          },
          remove: false,
          success: function() {
            callback();
          },
          error: function(model, error) {
            callback(error, model);
          }
        });
      }, this),
      _.bind(function(callback) {
        this.fetch({
          data: {
            start: moment(momentMonthStart).format('YYYY-MM-DD'),
            end: moment(momentMonthEnd).subtract('24', 'days').format('YYYY-MM-DD')
          },
          remove: false,
          success: function() {
            callback();
          },
          error: function(model, error) {
            callback(error, model);
          }
        });
      }, this)
    ], _.bind(function(error) {
      if (error) {
        if (typeof callbackError === 'function') {
          callbackError(error);
        }
      } else {
        if (typeof callbackSuccess === 'function') {
          callbackSuccess(this);
        }
      }
    }, this));
  },
  /**
   * @method fetchToday
   * @param {Function} [callbackSuccess]
   * @param {Function} [callbackError]
   */
  fetchToday: function(callbackSuccess, callbackError) {
    this.fetch({
      data: {
        start: moment().tz(app.user.get('timezone')).subtract(4, 'hours').format('YYYY-MM-DD')
      },
      success: _.bind(function(model) {
        if (typeof callbackSuccess === 'function') {
          callbackSuccess(model);
        }
      }, this),
      error: _.bind(function(model, error) {
        if (typeof callbackError === 'function') {
          callbackError(error, model);
        }
      }, this)
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
    var today = moment().tz(app.user.get('timezone')).subtract(4, 'hours').format('YYYY-MM-DD');
    var stat = this.get(today);
    return stat ? stat.get('timeStudied').day : 0;
  },
  /**
   * @method getGoalItemPercent
   * @returns {Number}
   */
  getGoalItemPercent: function() {
    var goal = app.user.getGoal();
    var totalItems = app.user.data.stats.getDailyItemsReviewed();
    var percentItems = Math.round(totalItems / goal.value * 100);
    return percentItems > 100 ? 100 : parseFloat(percentItems.toFixed(2));
  },
  /**
   * @method getGoalTimePercent
   * @returns {Number}
   */
  getGoalTimePercent: function() {
    var goal = app.user.getGoal();
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
      data[date] = stat.getStudiedCount();
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
    for (var i = 0, length = this.length; i < length; i++) {
      var stat = this.at(i);
      if (stat.hasBeenStudied()) {
        currentStreak++;
      }
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
      }
      if (!stat.hasBeenStudied()) {
        currentStreak = 0;
      }
    }
    return bestStreak;
  }
});
