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
            return this.get('timeStudied') ? Math.floor(this.get('timeStudied').day) : 0;
        },
        /**
         * @method getTimerOffset
         * @returns {Number}
         */
        getTimerOffset: function() {
            return this.get('timeStudied').day ? this.get('timeStudied').day : 0;
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
                    app.api.getStats({start: date.today}, function(data) {
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