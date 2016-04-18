var SkritterCollection = require('base/skritter-collection');
var ProgressStat = require('models/progress-stat');

/**
 * @class ProgressStats
 * @extends {SkritterCollection}
 */
module.exports = SkritterCollection.extend({

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
      return -1;
    } else if (statB.id > statA.id) {
      return 1;
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
    var now = moment().startOf('day').toDate();
    var stats = response.ProgressStats.filter(function(s) {
      return Date.parse(s.date) <= now;
    });
    return stats;
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
    return this.getItemsLearnedForPeriod('char', 'all');
  },

  /**
   * @method getAllTimeWordsLearned
   * @returns {Number}
   */
  getAllTimeWordsLearned: function() {
    return this.getItemsLearnedForPeriod('word', 'all');
  },

  /**
   * Gets the total amount of time a user has spent studying for the lifetime of their account.
   * @returns {object} the amount of time studied as a string with a units property
   *                   specifiying the largest denomination of the amount property.
   */
  getAllTimeTimeStudied: function() {
    if (!this.length) {
      return {amount: '0', units: 'seconds'};
    }

    var timeStudied = this.at(0).get('timeStudied');
    var allStudied = Math.floor(timeStudied.all);
    var seconds = Math.floor(allStudied) % 60;
    var minutes = Math.floor(allStudied / 60) % 60;
    var hours = Math.floor(allStudied / 3600);

    var largestUnit = hours ? 'hours' :
      minutes ? 'minutes' :
        'seconds';
    var amount = hours ? '' + hours + ':' + minutes + ':' + seconds :
      minutes ? minutes + ':' + seconds :
        seconds;
    return {
      amount: amount,
      units: largestUnit
    };
  },

  getAverageTimeStudied: function() {
    var avgTime = 0;

    for (var i = 0; i < this.length; i++) {
      avgTime += this.at(i).get('timeStudied').day;
    }

    return this.convertToLargestTimeUnit(avgTime / (this.length || 1));
  },

  convertToLargestTimeUnit: function(time) {
    var seconds = Math.floor(time) % 60;
    var minutes = Math.floor(time / 60) % 60;
    var hours = Math.floor(time / 3600);

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    var largestUnit = hours ? 'hours' :
      minutes ? 'minutes' :
        'seconds';


    var secondLargestUnit = largestUnit === 'hours' ? 'minutes' :
      largestUnit === 'minutes' ? 'seconds' :
        'seconds';
    var amount = hours ? '' + hours + ':' + minutes + ':' + seconds :
      minutes ? minutes + ':' + seconds :
        seconds;

    // note: this is a very English-centric hack--replace me with proper language strings!
    if (amount.split(':')[0] === '01') {
      largestUnit = largestUnit.slice(0, -1);
    }

    if (amount.split(':')[1] === '01') {
      secondLargestUnit = secondLargestUnit.slice(0, -1);
    }

    return {
      amount: amount,
      units: largestUnit,
      secondaryUnits: secondLargestUnit
    };
  },

  /**
   * Gets the total number of reviews a user has studied over their lifetime
   * @returns {Number} the total number of reviews a user has studied over their lifetime
   */
  getCountAllTimeReviews: function() {
    if (!this.length) {
      return 0;
    }

    var stat = this.at(0);
    var wordStats = stat.get('word');
    var charStats = stat.get('char');

    // .char, .word ... .defn .rdng .rune .tone ... .studied .all
    // gets the total number of reviews for both word and character reviews
    var totalNum = [wordStats, charStats].reduce(function(total, reviewCat) {

      // for a given stat, loops through the parts (defn, rdng, etc.)
      // and sums the numbers of .studied.all for each part.
      var partsTotal = Object.keys(reviewCat).reduce(function(pTotal, studyPart) {
        return pTotal + reviewCat[studyPart].studied.all;
      }, 0);

      return total + partsTotal;
    }, 0);

    return totalNum;
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
   * Gets the best or current monthly studying streak.
   * Defaults to best streak unless current is specified as a parameter.
   * @method getMonthlyStreak
   * @param {Boolean} [current] whether to return the current or the best streak.
   * @returns {Number} The number of days the user has studied
   */
  getMonthlyStreak: function(current) {
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
        if (current) {
          return currentStreak;
        }
        currentStreak = 0;
      }
    }
    return bestStreak;
  },

  getItemsLearnedForPeriod: function(itemType, timePeriod) {
    itemType = itemType || 'word';
    timePeriod = timePeriod || 'month';

    return this.length ? this.at(0).get(itemType).rune.learned[timePeriod] : 0;
  }
});
