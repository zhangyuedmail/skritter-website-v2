/**
 * @module Application
 */
define([
    'core/modules/GelatoCollection',
    'modules/models/DataVocabList'
], function(GelatoCollection, DataVocabList) {

    /**
     * @class DataVocabLists
     * @extends GelatoCollection
     */
    var DataVocabLists = GelatoCollection.extend({
        /**
         * @method initialize
         * @param {Array} [models]
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(models, options) {
            options = options || {};
            this.app = options.app;
        },
        /**
         * @property model
         * @type DataVocabList
         */
        model: DataVocabList,
        /**
         * @method fetch
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        fetch: function(callbackSuccess, callbackError) {
            var self = this;
            Async.waterfall([
                function(callback) {
                    var ids = [];
                    (function next(cursor) {
                        self.app.api.fetchVocabLists({
                            cursor: cursor,
                            fields: 'id',
                            lang: self.app.user.getLanguageCode(),
                            sort: 'studying'
                        }, function(result) {
                            var pluckedIds = _.pluck(result.VocabLists, 'id');
                            ids = ids.concat(pluckedIds);
                            if (result.cursor) {
                                next(result.cursor);
                            } else {
                                callback(null, ids);
                            }
                        }, function(error) {
                            callback(error);
                        });
                    })();
                },
                function(ids, callback) {
                    self.fetchById(ids, function(result) {
                        callback(null, result);
                    }, function(error) {
                        callback(error);
                    });
                }
            ], function(error, result) {
                if (error) {
                    if (typeof callbackError === 'function') {
                        callbackError(error);
                    }
                } else {
                    if (typeof callbackSuccess === 'function') {
                        callbackSuccess(result);
                    }
                }
            });
        },
        /**
         * @method fetchById
         * @param {Array|String} id
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        fetchById: function(id, callbackSuccess, callbackError) {
            var self = this;
            this.app.api.fetchVocabList(id, null, function(result) {
                self.app.user.data.insert({VocabLists: result}, function() {
                    result = self.add(result, {merge: true, silent: true});
                    self.trigger('add', self);
                    if (typeof callbackSuccess === 'function') {
                        callbackSuccess(result);
                    }
                });
            }, function(error) {
                if (typeof callbackError === 'function') {
                    callbackError(error);
                }
            });
        },
        /**
         * @method fetchOfficial
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        fetchOfficial: function(callbackSuccess, callbackError) {
            var self = this;
            (function next(cursor) {
                self.app.api.fetchVocabLists({
                    cursor: cursor,
                    lang: self.app.user.getLanguageCode(),
                    sort: 'official'
                }, function(result) {
                    self.app.user.data.insert(result, function() {
                        self.add(result.VocabLists, {merge: true, silent: true});
                        self.trigger('add', self);
                        if (result.cursor) {
                            next(result.cursor);
                        } else {
                            if (typeof callbackSuccess === 'function') {
                                callbackSuccess(self);
                            }
                        }
                    });
                }, function(error) {
                    if (typeof callbackError === 'function') {
                        callbackError(error);
                    }
                });
            })();
        },
        /**
         * @method getAdding
         * @returns {Array}
         */
        getAdding: function() {
            return this.filter(function(list) {
                return list.get('studyingMode') === 'adding';
            });
        },
        /**
         * @method getFinished
         * @returns {Array}
         */
        getFinished: function() {
            return this.filter(function(list) {
                return list.get('studyingMode') === 'finished';
            });
        },
        /**
         * @method getNotStudying
         * @returns {Array}
         */
        getNotStudying: function() {
            return this.filter(function(list) {
                return list.get('studyingMode') === 'not studying';
            });
        },
        /**
         * @method getOfficial
         * @returns {Array}
         */
        getOfficial: function() {
            return this.filter(function(list) {
                return list.get('sort') === 'official';
            });
        },
        /**
         * @method getReviewing
         * @returns {Array}
         */
        getReviewing: function() {
            return this.filter(function(list) {
                return list.get('studyingMode') === 'reviewing';
            });
        },
        /**
         * @method load
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         * @returns {DataVocabLists}
         */
        load: function(callbackSuccess, callbackError) {
            var self = this;
            Async.series([
                function(callback) {
                    self.app.user.storage.all('vocablists', function(result) {
                        self.add(result, {silent: true});
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

    return DataVocabLists;

});