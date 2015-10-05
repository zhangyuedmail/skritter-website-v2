var GelatoComponent = require('gelato/component');

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
 * @class StudyToolbarTimer
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.interval = undefined;
        this.localOffset = 0;
        this.seconds = 0;
        this.serverOffset = 0;
        this.stopwatch = new Stopwatch();
        this.time = 0;
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method remove
     * @returns {StudyToolbarTimer}
     */
    remove: function() {
        this.interval = clearInterval(this.interval);
        return GelatoComponent.prototype.remove.call(this);
    },
    /**
     * @method render
     * @returns {StudyToolbarTimer}
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
    },
    /**
     * @method addServerOffset
     * @param {Number} value
     */
    addServerOffset: function(value) {
        this.serverOffset += value;
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
    },
    /**
     * @method setServerOffset
     * @param {Number} value
     */
    setServerOffset: function(value) {
        this.serverOffset = value;
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
