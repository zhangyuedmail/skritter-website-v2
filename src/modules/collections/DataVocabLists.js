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
         * @constructor
         */
        initialize: function() {},
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
            var vocablistIds = [];
            Async.series([
                function(callback) {
                    (function next(cursor) {
                        app.api.fetchVocabLists({
                            cursor: cursor,
                            fields: 'id',
                            lang: app.user.getLanguageCode(),
                            sort: 'studying'
                        }, function(result) {
                            var resultIds = _.pluck(result.VocabLists, 'id');
                            vocablistIds = vocablistIds.concat(resultIds);
                            if (result.cursor) {
                                next(result.cursor);
                            } else {
                                callback();
                            }
                        }, function(error) {
                            callback(error);
                        });
                    })();
                },
                function(callback) {
                    self.fetchById(vocablistIds, function() {
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
        },
        /**
         * @method fetchById
         * @param {Array|String} id
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        fetchById: function(id, callbackSuccess, callbackError) {
            var self = this;
            app.api.fetchVocabList(id, null, function(result) {
                result = self.add(result, {merge: true});
                if (typeof callbackSuccess === 'function') {
                    callbackSuccess(result);
                }
            }, function(error) {
                if (typeof callbackError === 'function') {
                    callbackError(error);
                }
            });
        },
        /**
         * @method fetchCustom
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        fetchCustom: function(callbackSuccess, callbackError) {
            var self = this;
            (function next(cursor) {
                app.api.fetchVocabLists({
                    cursor: cursor,
                    lang: app.user.getLanguageCode(),
                    sort: 'custom'
                }, function(result) {
                    self.add(result.VocabLists, {merge: true});
                    if (result.cursor) {
                        next(result.cursor);
                    } else {
                        if (typeof callbackSuccess === 'function') {
                            callbackSuccess(self);
                        }
                    }
                }, function(error) {
                    if (typeof callbackError === 'function') {
                        callbackError(error);
                    }
                });
            })();
        },
        /**
         * @method fetchOfficial
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        fetchOfficial: function(callbackSuccess, callbackError) {
            var self = this;
            (function next(cursor) {
                app.api.fetchVocabLists({
                    cursor: cursor,
                    lang: app.user.getLanguageCode(),
                    sort: 'official'
                }, function(result) {
                    self.add(result.VocabLists, {merge: true});
                    if (result.cursor) {
                        next(result.cursor);
                    } else {
                        if (typeof callbackSuccess === 'function') {
                            callbackSuccess(self);
                        }
                    }
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
            return _.filter(this.models, function(list) {
                return list.get('studyingMode') === 'finished';
            });
        },
        /**
         * @method getNotStudying
         * @returns {Array}
         */
        getNotStudying: function() {
            return _.filter(this.models, function(list) {
                return list.get('studyingMode') === 'not studying';
            });
        },
        /**
         * @method getCustom
         * @returns {Array}
         */
        getCustom: function() {
            return _.filter(this.models, function(list) {
                return list.get('sort') === 'custom';
            });
        },
        /**
         * @method getOfficial
         * @returns {Array}
         */
        getOfficial: function() {
            return _.filter(this.models, function(list) {
                return list.get('sort') === 'official';
            });
        },
        /**
         * @method getReviewing
         * @returns {Array}
         */
        getReviewing: function() {
            return _.filter(this.models, function(list) {
                return list.get('studyingMode') === 'reviewing';
            });
        }
    });

    return DataVocabLists;

});