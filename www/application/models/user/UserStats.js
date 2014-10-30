/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class UserStats
     * @extends BaseModel
     */
    var UserStats = BaseModel.extend({
        /**
         * @method initialize
         * @param {User} user
         * @constructor
         */
        initialize: function(attributes, options) {
            this.user = options.user;
            this.on('change', this.cache);
        },
        /**
         * @property
         * @type Object
         */
        defaults: {
            char: {},
            daysStudied: {},
            timeStudied: {},
            word: {}
        },
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem(this.user.id + '-stats', JSON.stringify(this.toJSON()));
        },
        /**
         * @method getCharLearnedTotal
         * @param {String} step
         */
        getCharLearnedTotal: function(step) {
            var total = 0;
            for (var part in this.get('char')) {
                total += this.get('char')[part].learned[step];
            }
            return total;
        },
        /**
         * @method getStudied
         * @returns {Number}
         */
        getStudied: function() {
            var studiedCount = 0;
            var word =  this.get('word') ? this.get('word') : {};
            for (var part in word) {
                studiedCount += word[part].studied.day;
            }
            return studiedCount;
        },
        /**
         * @method getTime
         * @returns {Number}
         */
        getTime: function() {
            var timeStudied = this.get('timeStudied') ? Math.floor(this.get('timeStudied').day) : 0;
            return timeStudied + this.user.reviews.getTimerOffset();
        },
        /**
         * @method getTimerOffset
         * @returns {Number}
         */
        getTimerOffset: function() {
            return this.get('timeStudied').day ? this.get('timeStudied').day : 0;
        },
        /**
         * @method getWordLearnedTotal
         * @param {String} step
         */
        getWordLearnedTotal: function(step) {
            var total = 0;
            for (var part in this.get('word')) {
                total += this.get('word')[part].learned[step];
            }
            return total;
        },
        /**
         * @method sync
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        sync: function(callbackSuccess, callbackError) {
            var self = this;
            async.waterfall([
                function(callback) {
                    app.api.getDate(function(data) {
                        callback(null, data);
                    }, function(error) {
                        callback(error);
                    });
                },
                function(date, callback) {
                    app.api.getStats({
                        lang: app.user.getLanguageCode(),
                        start: date.today
                    }, function(data) {
                        self.set(data[0]);
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
        }
    });

    return UserStats;
});