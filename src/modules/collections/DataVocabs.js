/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoCollection',
    'modules/models/DataVocab'
], function(GelatoCollection, DataVocab) {

    /**
     * @class DataVocabs
     * @extends GelatoCollection
     */
    var DataVocabs = GelatoCollection.extend({
        /**
         * @method initialize
         * @param {Array} [models]
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(models, options) {
            options = options || {};
        },
        /**
         * @property model
         * @type DataVocab
         */
        model: DataVocab,
        /**
         * @method fetchByQuery
         * @param {String} writing
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        fetchByQuery: function(writing, callbackSuccess, callbackError) {
            var id = null;
            var vocab = null;
            Async.series([
                function(callback) {
                    app.api.fetchVocabs({
                        q: writing,
                        fields: 'id'
                    }, function(result) {
                        if (result.Vocabs.length) {
                            id = result.Vocabs[0].id;
                            callback();
                        } else {
                            callback(new Error('No vocabs found.'));
                        }
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    app.api.fetchVocabs({
                        ids: id,
                        include_decomps: true,
                        include_strokes: true
                    }, function(result) {
                        if (result.Vocabs.length) {
                            vocab = result.Vocabs[0];
                            app.user.data.add(result, callback);
                        } else {
                            callback(new Error('No vocabs found.'));
                        }
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    if (vocab.containedVocabIds) {
                        app.api.fetchVocabs({
                            q: writing,
                            ids: vocab.containedVocabIds.join('|'),
                            include_decomps: true,
                            include_strokes: true
                        }, function(result) {
                            app.user.data.add(result, callback);
                        }, function(error) {
                            callback(error);
                        });
                    } else {
                        callback();
                    }
                }
            ], function(error) {
                if (error) {
                    callbackError(error);
                } else {
                    callbackSuccess(app.user.data.vocabs.get(vocab.id));
                }
            });
        },
        /**
         * @method load
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         * @returns {DataVocabs}
         */
        load: function(writing, callbackSuccess, callbackError) {
            var self = this;
            var vocabId = app.fn.mapper.toBase(writing);
            Async.waterfall([
                function(callback) {
                    app.user.storage.get('vocabs', vocabId, function(result) {
                        callback(null, result);
                    }, function() {
                        callback();
                    });
                },
                function(vocab, callback) {
                    if (vocab) {
                        callback(null, vocab);
                    } else {
                        app.api.fetchVocabs({ids: vocabId}, function(result) {
                            callback(null, result.Vocabs[0]);
                        }, function(error) {
                            callback(error);
                        });
                    }
                }
            ], function(error, vocab) {
                if (error) {
                    callbackError(error);
                } else {
                    callbackSuccess(self.add(vocab));
                }
            });
            return this;
        }
    });

    return DataVocabs;

});