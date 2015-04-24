/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoCollection',
    'modules/models/DataStat'
], function(GelatoCollection, DataStat) {

    /**
     * @class DataStats
     * @extends GelatoCollection
     */
    var DataStats = GelatoCollection.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.api = app.api;
            this.user = app.user;
        },
        /**
         * @property model
         * @type DataStat
         */
        model: DataStat,
        /**
         * @method comparator
         * @param {DataStat} statA
         * @param {DataStat} statB
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
         * @method fetch
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        fetch: function(callbackSuccess, callbackError) {
            var self = this;
            var momentMonthStart = Moment().startOf('month');
            var momentMonthEnd = Moment().endOf('month');
            Async.series([
                function(callback) {
                    self.api.fetchStats({
                        start: Moment(momentMonthEnd).subtract('11', 'days').format('YYYY-MM-DD'),
                        end: Moment(momentMonthEnd).format('YYYY-MM-DD')
                    }, function(result) {
                        self.user.storage.put('stats', result, function() {
                            self.add(result, {merge: true});
                            callback();
                        }, function(error) {
                            callback(error);
                        });
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    self.api.fetchStats({
                        start: Moment(momentMonthEnd).subtract('23', 'days').format('YYYY-MM-DD'),
                        end: Moment(momentMonthEnd).subtract('12', 'days').format('YYYY-MM-DD')
                    }, function(result) {
                        self.user.storage.put('stats', result, function() {
                            self.add(result, {merge: true});
                            callback();
                        }, function(error) {
                            callback(error);
                        });
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    self.api.fetchStats({
                        start: Moment(momentMonthStart).format('YYYY-MM-DD'),
                        end: Moment(momentMonthEnd).subtract('24', 'days').format('YYYY-MM-DD')
                    }, function(result) {
                        self.user.storage.put('stats', result, function() {
                            self.add(result, {merge: true});
                            callback();
                        }, function(error) {
                            callback(error);
                        });
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
        },
        /**
         * @method getTotalCharactersLearned
         * @returns {Number}
         */
        getTotalCharactersLearned: function() {
            return this.length ? this.at(0).get('char').rune.learned.all : 0;
        },
        /**
         * @method getTotalWordsLearned
         * @returns {Number}
         */
        getTotalWordsLearned: function() {
            return this.length ? this.at(0).get('word').rune.learned.all : 0;
        },
        /**
         * @method load
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         * @returns {DataStats}
         */
        load: function(callbackSuccess, callbackError) {
            var self = this;
            Async.series([
                function(callback) {
                    app.user.storage.all('stats', function(result) {
                        self.add(result, {merge: true, silent: true});
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    self.fetch();
                    callback();
                }
            ], function(error) {
                if (error) {
                    callbackError(error);
                } else {
                    callbackSuccess();
                }
            });
            return this;
        }
    });

    return DataStats;

});