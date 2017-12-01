const GelatoComponent = require('gelato/component');
const vent = require('vent');
const config = require('config');

/**
 * A timer constructor function. Creates an object that records the passage of
 * time and can be started, stopped, and reset.
 * @class StudyToolbarStopwatch
 * @constructor
 */
function Stopwatch () {
  let startAt = 0;
  let lapTime = 0;
  let startTime = 0;

  this.start = function () {
    startAt = startAt ? startAt : new Date().getTime();
    startTime = new Date().getTime();
  };

  this.stop = function () {
    lapTime = startAt ? lapTime + new Date().getTime() - startAt : lapTime;
    startAt = 0;
  };

  this.reset = function () {
    lapTime = startAt = 0;
  };

  /**
   * Gets the total time recorded by this timer
   * @return {number}
   */
  this.time = function () {
    return lapTime + (startAt ? new Date().getTime() - startAt : 0);
  };

  /**
   * Gets the duration the timer has been running since it was last started.
   * @return {number} the number of ms elapsed
   */
  this.getRunningTime = function () {
    return (new Date().getTime() - startTime);
  };
}

/**
 * @class StudyToolbarTimerComponent
 * @extends {GelatoComponent}
 */
const StudyToolbarTimerComponent = GelatoComponent.extend({

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StudyToolbarTimerComponent.jade'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function (options) {
    options = options || {};

    this.showIcon = options.showIcon;
    this.interval = null;
    this.localOffset = 0;
    this.seconds = 0;
    this.serverOffset = 0;
    this.stopwatch = new Stopwatch();
    this.time = 0;
    this.promptType = null;

    this.listenTo(vent, 'prompt-part:rendered', this.start);
    this.listenTo(vent, 'item:start', this.start);
    this.listenTo(vent, 'item:stop', this.stop);
  },

  /**
   * @method remove
   * @returns {StudyToolbarTimerComponent}
   */
  remove: function () {
    this.interval = clearInterval(this.interval);

    return GelatoComponent.prototype.remove.call(this);
  },

  /**
   * @method render
   * @returns {StudyToolbarTimerComponent}
   */
  render: function () {
    this.renderTemplate();

    return this;
  },

  /**
   * @method addLocalOffset
   * @param {Number} value
   */
  addLocalOffset: function (value) {
    this.localOffset += value;
    this.update();
  },

  /**
   * @method addServerOffset
   * @param {Number} value
   */
  addServerOffset: function (value) {
    this.serverOffset += value;
    this.update();
  },

  /**
   * @method getOffset
   * @returns {Number}
   */
  getOffset: function () {
    return (this.localOffset + this.serverOffset) * 1000;
  },

  /**
   * Gets the total running time of the timer in seconds
   * @param {Boolean} [printable] whether to return a user-friendly string representation of the time spent
   * @return {number|string} number of seconds the timer has been running, or a formatted string of that value
   */
  getTotalRunningTime: function (printable) {
    const totalRunningTime = this.stopwatch.time() + this.getOffset();
    const totalRunningSeconds = totalRunningTime / 1000 >> 0;

    return printable ? app.fn.convertTimeToClock(totalRunningTime) : totalRunningSeconds;
  },

  /**
   * @method isStarted
   * @returns {Boolean}
   */
  isStarted: function () {
    return this.interval ? true : false;
  },

  /**
   * @method isStopped
   * @returns {Boolean}
   */
  isStopped: function () {
    return this.interval ? false : true;
  },

  /**
   * @method reset
   */
  reset: function () {
    this.stopwatch.reset();
    this.lapOffset = 0;
  },

  /**
   * @method setLocalOffset
   * @param {Number} value
   */
  setLocalOffset: function (value) {
    this.localOffset = value;
    this.update();
  },

  /**
   * @method setServerOffset
   * @param {Number} value
   */
  setServerOffset: function (value) {
    this.serverOffset = value;
    this.update();
  },

  /**
   * Starts the timer, checking first if it's a good idea to start it on
   * the current prompt (i.e. the prompt's already completed),
   * and sets what kind of prompt is being timed.
   * @param {ReviewCollection} [reviews] the current reviews
   * @method start
   */
  start: function (reviews) {
    if (reviews && reviews.part) {
      this.promptType = reviews.part;

      if (reviews.current() && reviews.current().isComplete()) {
        this.stop();
        return;
      }
    }

    if (this.isStopped()) {
      this.stopwatch.start();
      this.interval = setInterval(this.update.bind(this), 200);
    }
  },

  /**
   * Stops the timer if it was running
   * @method stop
   */
  stop: function () {
    if (this.isStarted()) {
      this.stopwatch.stop();
      this.interval = clearInterval(this.interval);
    }
  },

  /**
   * Calculates the new time, sets instance variables,
   * and if the time display needs to be updated, updates the UI.
   * @method update
   */
  update: function () {
    const time = this.stopwatch.getRunningTime();
    const seconds = time / 1000 >> 0;
    const totalRunningTime = this.stopwatch.time() + this.getOffset();
    const totalRunningSeconds = totalRunningTime / 1000 >> 0;
    const maxAnswerTime = this.promptType ? config.maxPromptTimes[this.promptType] : 30;

    if (seconds >= maxAnswerTime) {
      this.stop();
    }

    if (totalRunningSeconds !== this.seconds) {
      this.time = totalRunningTime;
      this.seconds = totalRunningSeconds;

      this.$('#time').text(app.fn.convertTimeToClock(this.time));
    }
  },

});

module.exports = StudyToolbarTimerComponent;
