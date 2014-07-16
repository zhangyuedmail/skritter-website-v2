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
            this.lap = 0;
            this.lapOffset = 0;
            this.lapStart = 0;
            this.offset = 0;
            this.reviewLimit = 30000;
            this.stopwatch = new Stopwatch();
            this.thinkingLimit = 15000;
            this.thinkingValue = 0;
            this.time = 0;
        },
        /**
         * @method render
         * @returns {Timer}
         */
        render: function() {
            this.$el.text('0:00');
            return this;
        },
        /**
         * @method getLapTime
         * @returns {Number}
         */
        getLapTime: function() {
            return this.lap + this.lapOffset;
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
            if (this.thinkingValue) {
                return this.thinkingValue;
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
         * @method reset
         * @returns {Timer}
         */
        reset: function() {
            this.lap = this.lapOffset = this.lapStart = 0;
            this.thinkingValue = 0;
            return this;
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
         * @method setLapOffset
         * @param {Number} lapOffset
         * @return {Timer}
         */
        setLapOffset: function(lapOffset) {
            this.lapOffset = lapOffset ? lapOffset : 0;
            return this;
        },
        /**
         * @method setThinkingValue
         * @param {Number} lapOffset
         * @return {Timer}
         */
        setThinkingValue: function(thinkingValue) {
            this.thinkingValue = thinkingValue ? thinkingValue : 0;
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
                this.interval = setInterval(_.bind(this.update, this), 10);
            }
            return this;
        },
        /**
         * @method stop
         * @returns {Timer}
         */
        stop: function() {
            if (this.isRunning()) {
                this.lapOffset += this.lap;
                this.stopwatch.stop();
                this.interval = clearInterval(this.interval);
                this.lap = 0;
            }
            return this;
        },
        /**
         * @method update
         */
        update: function() {
            var now = new Date().getTime();
            var time = this.stopwatch.time() + this.offset;
            this.lap = now - this.lapStart;
            if (time / 1000 >> 0 !== this.time / 1000 >> 0) {
                this.time = time;
                var hours = (time / (3600 * 1000)) >> 0;
                time = time % (3600 * 1000);
                var minutes = (time / (60 * 1000)) >> 0;
                time = time % (60 * 1000);
                var seconds = (time / 1000) >> 0;
                if (hours > 0) {
                    this.$el.text(hours + ':' + skritter.fn.pad(minutes, 0, 2) + ':' + skritter.fn.pad(seconds, 0, 2));
                } else {
                    this.$el.text(minutes + ':' + skritter.fn.pad(seconds, 0, 2));
                }
                if (this.isLimit()) {
                    this.stop();
                }
            }
        }
    });

    return Timer;
});