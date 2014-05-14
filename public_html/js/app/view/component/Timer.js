/**
 * @module Skritter
 * @submodule Views
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class Stopwatch
     * @param {Number} offset
     */
    var Stopwatch = function(offset) {
        offset = (offset) ? offset : 0;
        var startAt = 0;
        var lapTime = 0 + offset;
        var now = function() {
            var date = new Date();
            return date.getTime();
        };
        this.start = function() {
            startAt = startAt ? startAt : now();
        };
        this.stop = function() {
            lapTime = startAt ? lapTime + now() - startAt : lapTime;
            startAt = 0;
        };
        this.reset = function() {
            lapTime = startAt = 0;
        };
        this.time = function() {
            return lapTime + (startAt ? now() - startAt : 0);
        };
    };
    /**
     * @class Timer
     */
    var Timer = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.interval = null;
            this.getLapTime = function() {
                return this.lapStartAt ? this.lapTime + skritter.fn.getUnixTime(true) - this.lapStartAt : this.lapTime;
            };
            this.lapStartAt = 0;
            this.lapTime = 0;
            this.reviewLimit = 30;
            this.reviewStart = null;
            this.reviewStop = null;
            this.offset = 0;
            this.stopwatch = new Stopwatch();
            this.thinkingLimit = 15;
            this.thinkingStop = null;
            this.time = 0;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            var time = (time) ? time : this.time;
            //adjusts the rendered time for the offset
            time += this.offset * 1000;
            //switched to bitwise operations for better performance across browsers
            var hours = (time / (3600 * 1000)) >> 0;
            time = time % (3600 * 1000);
            var minutes = (time / (60 * 1000)) >> 0;
            time = time % (60 * 1000);
            var seconds = (time / 1000) >> 0;
            //var milliseconds = time % 1000;
            if (hours > 0) {
                this.$el.html(hours + ':' + skritter.fn.pad(minutes, 0, 2) + ':' + skritter.fn.pad(seconds, 0, 2));
            } else {
                this.$el.html(minutes + ':' + skritter.fn.pad(seconds, 0, 2));
            }
            return this;
        },
        /**
         * @method getReviewTime
         * @returns {Number}
         */
        getReviewTime: function() {
            var lapTime = this.getLapTime() / 1000;
            if (lapTime >= this.reviewLimit)
                return this.reviewLimit;
            return lapTime;
        },
        /**
         * @method getStartTime
         * @returns {Number}
         */
        getStartTime: function() {
            return parseInt(this.reviewStart / 1000, 10);
        },
        /**
         * @method getThinkingTime
         * @returns {Number}
         */
        getThinkingTime: function() {
            var lapTime = this.getLapTime() / 1000;
            if (this.thinkingStop) {
                var thinkingTime = (this.thinkingStop - this.reviewStart) / 1000;
                if (thinkingTime >= this.thinkingLimit)
                    return this.thinkingLimit;
                return thinkingTime;
            }
            if (lapTime >= this.thinkingLimit)
                return this.thinkingLimit;
            return lapTime;
        },
        /**
         * @method isReviewLimitReached
         * @returns {Boolean}
         */
        isReviewLimitReached: function() {
            if (this.getLapTime() >= this.reviewLimit * 1000)
                return true;
            return false;
        },
        /**
         * @method isRunning
         * @returns {Boolean}
         */
        isRunning: function() {
            if (this.interval)
                return true;
            return false;
        },
        /**
         * @method isThinkingLimitReached
         * @returns {Boolean}
         */
        isThinkingLimitReached: function() {
            if (this.getLapTime() >= this.thinkingLimit * 1000)
                return true;
            return false;
        },
        /**
         * Refreshes the offset based on the gathered total study time for the day.
         * 
         * @method refresh
         * @param {Boolean} includeServer
         * @param {Function} callback
         */
        refresh: function(includeServer, callback) {
            this.offset = skritter.user.data.reviews.getTotalTime();
            if (includeServer) {
                skritter.api.getProgStats({
                }, _.bind(function(progstats, status) {
                    if (status === 200) {
                        this.offset += progstats[0].timeStudied.day;
                    }
                    if (typeof callback === 'function') {
                        callback();
                    }
                }, this));
            } else {
                if (typeof callback === 'function') {
                    callback();
                }
            }
        },
        /**
         * @method reset
         * @returns {Backbone.View}
         */
        reset: function() {
            if (!this.isRunning()) {
                this.lapStartAt = 0;
                this.lapTime = 0;
                this.reviewStart = null;
                this.reviewStop = null;
                this.thinkingStop = null;
            }
            return this;
        },
        /**
         * @method setReviewLimit
         * @param {Number} value
         * @returns {Backbone.View}
         */
        setReviewLimit: function(value) {
            this.reviewLimit = value;
            return this;
        },
        /**
         * @method setOffset
         * @param {Number} value
         * @returns {Backbone.View}
         */
        setOffset: function(value) {
            this.offset = value;
            return this;
        },
        /**
         * @method setThinkingLimit
         * @param {Number} value
         * @returns {Backbone.View}
         */
        setThinkingLimit: function(value) {
            this.thinkingLimit = value;
            return this;
        },
        /**
         * @method start
         */
        start: function() {
            if (!this.reviewStart)
                this.reviewStart = skritter.fn.getUnixTime(true);
            if (!this.isRunning() && !this.isReviewLimitReached()) {
                this.interval = setInterval(this.update, 10, this);
                this.lapStartAt = this.lapStartAt ? this.lapStartAt : skritter.fn.getUnixTime(true);
                this.stopwatch.start();
            }
        },
        /**
         * @method stop
         */
        stop: function() {
            if (this.isRunning()) {
                this.lapTime = this.lapStartAt ? this.lapTime + skritter.fn.getUnixTime(true) - this.lapStartAt : this.lapTime;
                this.lapStartAt = 0;
                this.reviewStop = skritter.fn.getUnixTime(true);
                this.stopwatch.stop();
                clearInterval(this.interval);
                this.interval = null;
            }
        },
        /**
         * @method stopThinking
         * @returns {Backbone.View}
         */
        stopThinking: function() {
            if (!this.thinkingStop)
                this.thinkingStop = skritter.fn.getUnixTime(true);
            return this;
        },
        /**
         * @method update
         * @param {Backbone.View} self
         */
        update: function(self) {
            //get the new time to check in milliseconds and seconds
            var time = self.stopwatch.time();
            var seconds = (time / 1000) >> 0;
            //only check and update things when a full second has elapsed
            if ((this.time / 1000) >> 0 !== seconds) {
                self.time = time;
                self.render();
                //stop the review timer if exceeds the set limit
                if (self.isReviewLimitReached())
                    self.stop();
            }
        }
    });

    return Timer;
});