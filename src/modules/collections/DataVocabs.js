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
         * @constructor
         */
        initialize: function() {},
        /**
         * @property model
         * @type DataVocab
         */
        model: DataVocab,
        /**
         * @method fetchById
         * @param {Array|String} vocabId
         * @param callbackSuccess
         * @param callbackError
         */
        fetchById: function(vocabId, callbackSuccess, callbackError) {
            var self = this;
            vocabId = Array.isArray(vocabId) ? vocabId : [vocabId];
            (function next() {
                    app.api.fetchVocabs({
                        ids: vocabId.slice(0,29).join('|')
                    }, function(result) {
                        app.user.data.insert(result, function() {
                            self.add(result.Vocabs, {merge: true});
                            vocabId.splice(0, 29);
                            if (vocabId.length) {
                                next();
                            } else {
                                callbackSuccess();
                            }
                        }, function(error) {
                            callbackError(error);
                        });
                    }, function(error) {
                        callbackError(error);
                    });
            }());
        },
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
         * @method fetchWord
         * @param {String} id
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        fetchWord: function(id, callbackSuccess, callbackError) {
            var self = this;
            var vocab = null;
            app.api.fetchVocabs({
                ids: id,
                include_decomps: true,
                include_heisigs: true,
                include_sentences: true,
                include_top_mnemonics: true
            }, function(result) {
                vocab = self.add(result.Vocabs[0], {merge: true});
                vocab.containing = self.add(result.ContainingVocabs, {merge: true});
                vocab.decomps = app.user.data.decomps.add(result.Decomps, {merge: true});
                vocab.sentences = app.user.data.sentences.add(result.Sentences, {merge: true});
                callbackSuccess(vocab);
            }, function(error) {
                callbackError(error);
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
                    app.user.data.storage.get('vocabs', vocabId, function(result) {
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