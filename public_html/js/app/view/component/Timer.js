define([], function() {
    /**
     * @class TimerStopwatch
     */
    function Stopwatch() {
        var startAt = 0;
        var lapTime = 0;
        function now() {
            return new Date().getTime();
        }
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
    }
    /**
     * @class Timer
     */
    var Timer = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.interval = undefined;
            this.lapOffset = 0;
            this.lapStart = 0
            this.lapTime = 0;
            this.localOffset = 0;
            this.reviewLimit = 30000;
            this.serverOffset = 0;
            this.stopwatch = new Stopwatch();
            this.thinkingLimit = 15000;
            this.thinkingTime = 0;
            this.time = 0;
            this.timeSecond = 0;
        },
        /**
         * @method render
         * @returns {Timer}
         */
        render: function() {
            this.$el.text(skritter.fn.convertTimeToClock(this.time));
            return this;
        },
        /**
         * @method getLapTime
         * @returns {Number}
         */
        getLapTime: function() {
            return this.lapTime + this.lapOffset;
        },
        /**
         * @method getOffset
         * @returns {number}
         */
        getOffset: function() {
            return (this.localOffset + this.serverOffset) * 1000;
        },
        /**
         * @method getReviewTime
         * @returns {Number}
         */
        getReviewTime: function() {
            var lapTime = this.getLapTime();
            return lapTime > this.reviewLimit ? this.reviewLimit / 1000 : lapTime / 1000;
        },
        /**
         * @method getThinkingTime
         * @returns {Number}
         */
        getThinkingTime: function() {
            var lapTime = this.getLapTime();
            if (this.thinkingTime) {
                return this.thinkingTime / 1000;
            }
            return lapTime > this.thinkingLimit ? this.thinkingLimit / 1000 : lapTime / 1000;
        },
        /**
         * @method isLimit
         * @return {Boolean}
         */
        isLimit: function() {
            return this.getLapTime() >= this.reviewLimit ? true : false;
        },
        /**
         * @method isRunning
         * @returns {Boolean}
         */
        isRunning: function() {
            return this.interval ? true : false;
        },
        /**
         * @method isThinking
         */
        isThinking: function() {
            return this.thinkingTime ? false : true;
        },
        /**
         * @method reset
         * @returns {Timer}
         */
        reset: function() {
            this.lapOffset = this.lapStart = this.lapTime = 0;
            this.thinkingTime = 0;
            return this;
        },
        /**
         * @method setLapOffset
         * @param {Number} offset
         */
        setLapOffset: function(offset) {
            this.lapOffset = offset * 1000;
        },
        /**
         * @method setLimit
         * @param {Number} reviewLimit
         * @param {Number} thinkingLimit
         * @return {Timer}
         */
        setLimit: function(reviewLimit, thinkingLimit) {
            this.reviewLimit = reviewLimit ? reviewLimit * 1000 : 0;
            this.thinkingLimit = thinkingLimit ? thinkingLimit * 1000 : 0;
            return this;
        },
        /**
         * @method setThinking
         * @param {Number} thinkingTime
         * @return {Timer}
         */
        setThinking: function(thinkingTime, thinkingLimit) {
            this.thinkingTime = thinkingTime ? thinkingTime * 1000 : 0;
            return this;
        },
        /**
         * @method start
         * @returns {Timer}
         */
        start: function() {
            if (!this.isRunning() && !this.isLimit()) {
                this.lapStart = new Date().getTime();
                this.stopwatch.start();
                this.interval = setInterval(_.bind(this.update, this), 100);
            }
            return this;
        },
        /**
         * @method stop
         * @returns {Timer}
         */
        stop: function() {
            if (this.isRunning()) {
                this.stopwatch.stop();
                this.interval = clearInterval(this.interval);
                this.lapOffset += this.lapTime;
                this.lapTime = 0;
            }
            return this;
        },
        /**
         * @method stopThinking
         */
        stopThinking: function() {
            this.thinkingTime = this.getLapTime();
        },
        /**
         * @method sync
         * @param {Function} callback
         */
        sync: function(callback) {
            async.waterfall([
                function(callback) {
                    this.localOffset = skritter.user.data.reviews.getTotalTime();
                    callback();
                },
                function(callback) {
                    skritter.api.getServerTime(function(time, status) {
                        if (status === 200) {
                            callback(null, time.today);
                        } else {
                            callback(time);
                        }
                    });
                },
                function(today, callback) {
                    skritter.api.getProgStats({start: today}, function(progstats, status) {
                        if (status === 200) {
                            callback(null, progstats[0].timeStudied.day);
                        } else {
                            callback(progstats);
                        }
                    });
                }
            ], _.bind(function(error, time) {
                if (!error && time) {
                    this.serverOffset = time;
                }
                if (typeof callback === 'function') {
                    callback();
                }
            }, this));
        },
        /**
         * @method update
         */
        update: function() {
            var now = new Date().getTime();
            this.time = this.stopwatch.time() + this.getOffset();
            this.lapTime = now - this.lapStart;
            if (this.isLimit()) this.stop();
            if (this.time / 1000 >> 0 !== this.timeSecond) {
                this.timeSecond = this.time / 1000 >> 0;
                this.$el.text(skritter.fn.convertTimeToClock(this.time));
            }
        }
    });

    return Timer;
});