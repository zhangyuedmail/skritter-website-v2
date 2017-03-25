const GelatoComponent = require('gelato/component');

/**
 * @class StudyToolbarStopwatch
 * @constructor
 */
function Stopwatch() {
  var startAt = 0;
  var lapTime = 0;
  this.start = function() {
    startAt = startAt ? startAt : new Date().getTime();
  };
  this.stop = function() {
    lapTime = startAt ? lapTime + new Date().getTime() - startAt : lapTime;
    startAt = 0;
  };
  this.reset = function() {
    lapTime = startAt = 0;
  };
  this.time = function() {
    return lapTime + (startAt ? new Date().getTime() - startAt : 0);
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
  initialize: function(options) {
    options = options || {};

    this.showIcon = options.showIcon;
    this.interval = null;
    this.localOffset = 0;
    this.seconds = 0;
    this.serverOffset = 0;
    this.stopwatch = new Stopwatch();
    this.time = 0;
  },

  /**
   * @method remove
   * @returns {StudyToolbarTimerComponent}
   */
  remove: function() {
    this.interval = clearInterval(this.interval);
    return GelatoComponent.prototype.remove.call(this);
  },

  /**
   * @method render
   * @returns {StudyToolbarTimerComponent}
   */
  render: function() {
    this.renderTemplate();
    return this;
  },

  /**
   * @method addLocalOffset
   * @param {Number} value
   */
  addLocalOffset: function(value) {
    this.localOffset += value;
    this.update();
  },

  /**
   * @method addServerOffset
   * @param {Number} value
   */
  addServerOffset: function(value) {
    this.serverOffset += value;
    this.update();
  },

  /**
   * @method getOffset
   * @returns {Number}
   */
  getOffset: function() {
    return (this.localOffset + this.serverOffset) * 1000;
  },

  /**
   * @method isStarted
   * @returns {Boolean}
   */
  isStarted: function() {
    return this.interval ? true : false;
  },

  /**
   * @method isStopped
   * @returns {Boolean}
   */
  isStopped: function() {
    return this.interval ? false : true;
  },

  /**
   * @method reset
   */
  reset: function() {
    this.stopwatch.reset();
    this.lapOffset = 0;
  },

  /**
   * @method setLocalOffset
   * @param {Number} value
   */
  setLocalOffset: function(value) {
    this.localOffset = value;
    this.update();
  },

  /**
   * @method setServerOffset
   * @param {Number} value
   */
  setServerOffset: function(value) {
    this.serverOffset = value;
    this.update();
  },

  /**
   * @method start
   */
  start: function() {
    if (this.isStopped()) {
      this.stopwatch.start();
      this.interval = setInterval(this.update.bind(this), 100);
    }
  },

  /**
   * @method stop
   */
  stop: function() {
    if (this.isStarted()) {
      this.stopwatch.stop();
      this.interval = clearInterval(this.interval);
    }
  },

  /**
   * @method update
   */
  update: function() {
    var time = this.stopwatch.time() + this.getOffset();
    var seconds = time / 1000 >> 0;
    if (seconds !== this.seconds) {
      this.time = time;
      this.seconds = seconds;
      this.render();
    }
  }

});

module.exports = StudyToolbarTimerComponent;
