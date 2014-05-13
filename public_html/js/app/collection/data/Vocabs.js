/**
 * @module Skritter
 * @submodule Collections
 * @param Vocab
 * @author Joshua McFarland
 */
define([
    'model/data/Vocab'
], function(Vocab) {
    /**
     * @class DataVocabs
     */
    var Vocabs = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @property {Vocab} model
         */
        model: Vocab,
        /**
         * @method insert
         * @param {Array|Object} vocabs
         * @param {Function} callback
         */
        insert: function(vocabs, callback) {
            skritter.storage.put('vocabs', vocabs, callback);
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('vocabs', _.bind(function(vocabs) {
                this.add(vocabs, {merge: true, silent: true, sort: false});
                callback();
            }, this));
        },
        /**
         * @method loadVocab
         * @param {String} vocabId
         * @param {Function} callback
         */
        loadVocab: function(vocabId, callback) {
            async.waterfall([
                function(callback) {
                    skritter.storage.get('vocabs', vocabId, function(vocab) {
                        if (vocab.length > 0) {
                            callback(null, skritter.user.data.vocabs.add(vocab[0], {merge: true, silent: true, sort: false}));
                        } else {
                            callback();
                        }
                    });
                },
                function(vocab, callback) {
                    if (vocab.has('sentenceId')) {
                        skritter.storage.get('sentences', vocab.get('sentenceId'), function(sentence) {
                            if (sentence) {
                                callback(null, vocab, skritter.user.data.sentences.add(sentence[0], {merge: true, silent: true, sort: false}));
                            } else {
                                callback();
                            }
                        });
                    } else {
                        callback(null, vocab);
                    }
                }
            ], function(error, vocab, sentence) {
                if (typeof callback === 'function') {
                    if (error) {
                        //TODO: add some kind of error handling here
                    } else {
                        callback(vocab, sentence);
                    }
                }
            });
        }
    });

    return Vocabs;
});