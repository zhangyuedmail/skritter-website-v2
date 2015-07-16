var GelatoCollection = require('gelato/modules/collection');
var DataVocablist = require('models/data-vocablist');

/**
 * @class DataVocablists
 * @extends {GelatoCollection}
 */
module.exports = GelatoCollection.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {},
    /**
     * @property model
     * @type {DataVocablist}
     */
    model: DataVocablist,
    /**
     * @method fetch
     * @param {Function} [callbackSuccess]
     * @param {Function} [callbackError]
     */
    fetch: function(callbackSuccess, callbackError) {
        var self = this;
        var ids = [];
        async.series([
            function(callback) {
                (function next(cursor) {
                    app.api.fetchVocabLists({
                        cursor: cursor,
                        fields: 'id',
                        lang: app.get('language'),
                        sort: 'studying'
                    }, function(result) {
                        var resultIds = _.pluck(result.VocabLists, 'id');
                        ids = ids.concat(resultIds);
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
                self.fetchById(ids, function() {
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
                self.trigger('fetch', self);
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
     * @method getAdding
     * @returns {Array}
     */
    getAdding: function() {
        return this.filter(function(list) {
            return list.get('studyingMode') === 'adding';
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
    }
});
