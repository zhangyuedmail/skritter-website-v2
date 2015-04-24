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
         * @param {Array|Object} [models]
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(models, options) {
            options = options || {};
            this.app = options.app;
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
            var self = this;
            var id = null;
            var vocab = null;
            Async.series([
                function(callback) {
                    self.app.api.fetchVocabs({
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
                    self.app.api.fetchVocabs({
                        ids: id,
                        include_decomps: true,
                        include_strokes: true
                    }, function(result) {
                        if (result.Vocabs.length) {
                            vocab = result.Vocabs[0];
                            self.app.user.data.add(result, callback);
                        } else {
                            callback(new Error('No vocabs found.'));
                        }
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    if (vocab.containedVocabIds) {
                        self.app.api.fetchVocabs({
                            q: writing,
                            ids: vocab.containedVocabIds.join('|'),
                            include_decomps: true,
                            include_strokes: true
                        }, function(result) {
                            self.app.user.data.add(result, callback);
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
                    callbackSuccess(self.app.user.data.vocabs.get(vocab.id));
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
            var vocabId = this.app.fn.mapper.toBase(writing);
            Async.waterfall([
                function(callback) {
                    self.app.user.storage.get('vocabs', vocabId, function(result) {
                        callback(null, result);
                    }, function() {
                        callback();
                    });
                },
                function(vocab, callback) {
                    if (vocab) {
                        callback(null, vocab);
                    } else {
                        self.app.api.fetchVocabs({ids: vocabId}, function(result) {
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