define([
    'collection/data/Decomps',
    'collection/data/Items',
    'collection/data/Params',
    'collection/data/Reviews',
    'collection/data/Sentences',
    'collection/data/SRSConfigs',
    'collection/data/Strokes',
    'collection/data/VocabLists',
    'collection/data/Vocabs'
], function(Decomps, Items, Params, Reviews, Sentences, SRSConfigs, Strokes, VocabLists, Vocabs) {
    /**
     * @class UserData
     */
    var Model = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.decomps = new Decomps();
            this.items = new Items();
            this.params = new Params();
            this.reviews = new Reviews();
            this.sentences = new Sentences();
            this.srsconfigs = new SRSConfigs();
            this.strokes = new Strokes();
            this.vocablists = new VocabLists();
            this.vocabs = new Vocabs();
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
        },
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem(skritter.user.id + '-data', JSON.stringify(this.toJSON()));
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            async.series([
                function(callback) {
                    skritter.user.data.decomps.loadAll(callback);
                },
                function(callback) {
                    skritter.user.data.items.loadAll(callback);
                },
                function(callback) {
                    skritter.user.data.reviews.loadAll(callback);
                },
                function(callback) {
                    skritter.user.data.sentences.loadAll(callback);
                },
                function(callback) {
                    skritter.user.data.srsconfigs.loadAll(callback);
                },
                function(callback) {
                    skritter.user.data.strokes.loadAll(callback);
                },
                function(callback) {
                    skritter.user.data.vocablists.loadAll(callback);
                },
                function(callback) {
                    skritter.user.data.vocabs.loadAll(callback);
                }
            ], function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method loadItem
         * @param {String} itemId
         * @param {Function} callback
         */
        loadItem: function(itemId, callback) {
            var part = itemId.split('-')[4];
            this.reset();
            async.waterfall([
                //intial item
                function(callback) {
                    skritter.storage.get('items', itemId, function(items) {
                        if (items.length > 0) {
                            callback(null, skritter.user.data.items.add(items[0], {merge: true, silent: true}));
                        } else {
                            callback('Initial item is missing.');
                        }
                    });
                },
                //intial vocab
                function(item, callback) {
                    skritter.storage.get('vocabs', item.getVocabId(), function(vocabs) {
                        if (vocabs.length > 0) {
                            callback(null, item, skritter.user.data.vocabs.add(vocabs[0], {merge: true, silent: true}));
                        } else {
                            callback("Initial vocab is missing.", item);
                        }
                    });
                },
                //contained items
                function(item, vocab, callback) {
                    if (part === 'rune' || part === 'tone') {
                        var containedItemIds = vocab.getContainedItemIds(part);
                        var containedItemCount = containedItemIds.length;
                        skritter.storage.get('items', containedItemIds, function(containedItems) {
                            if (containedItemCount === containedItems.length) {
                                callback(null, item, vocab, skritter.user.data.items.add(containedItems, {merge: true, silent: true}));
                            } else {
                                callback("One or more of the contained items is missing.", item);
                            }
                        });
                    } else {
                        callback(null, item, vocab, []);
                    }
                },
                //contained vocabs
                function(item, vocab, containedItems, callback) {
                    if (containedItems.length > 0) {
                        var containedVocabIds = vocab.get('containedVocabIds');
                        skritter.storage.get('vocabs', containedVocabIds, function(containedVocabs) {
                            if (containedVocabIds.length === containedVocabs.length) {
                                callback(null, item, vocab, containedItems, skritter.user.data.vocabs.add(containedVocabs, {merge: true, silent: true, sort: false}));
                            } else {
                                callback("One or more of the contained vocabs is missing.", item);
                            }
                        });
                    } else {
                        callback(null, item, vocab, containedItems, []);
                    }
                },
                //sentence
                function(item, vocab, containedItems, containedVocabs, callback) {
                    if (vocab.has('sentenceId')) {
                        skritter.storage.get('sentences', vocab.get('sentenceId'), function(sentences) {
                            if (sentences.length > 0) {
                                callback(null, item, vocab, containedItems, containedVocabs, skritter.user.data.sentences.add(sentences, {merge: true, silent: true}));
                            } else {
                                callback("Sentence is missing.", item);
                            }
                        });
                    } else {
                        callback(null, item, vocab, containedItems, containedVocabs, null);
                    }
                },
                //strokes
                function(item, vocab, containedItems, containedVocabs, sentence, callback) {
                    if (part === 'rune') {
                        var strokeWritings = null;
                        if (containedVocabs.length === 0) {
                            strokeWritings = vocab.get('writing');
                        } else {
                            strokeWritings = _.pluck(containedVocabs, function(vocab) {
                                return vocab.attributes.writing;
                            });
                        }
                        skritter.storage.get('strokes', strokeWritings, function(strokes) {
                            if (strokeWritings.length === strokes.length) {
                                callback(null, item, vocab, containedItems, containedVocabs, sentence, skritter.user.data.strokes.add(strokes, {merge: true, silent: true}));
                            } else {
                                callback("One or more of the strokes are missing.", item);
                            }
                        });
                    } else {
                        callback(null, item, vocab, containedItems, containedVocabs, sentence, null);
                    }
                },
                //decomps
                function(item, vocab, containedItems, containedVocabs, sentence, strokes, callback) {
                    var strokeWritings = null;
                    if (containedVocabs.length === 0) {
                        strokeWritings = vocab.get('writing');
                    } else {
                        strokeWritings = _.pluck(containedVocabs, function(vocab) {
                            return vocab.attributes.writing;
                        });
                    }
                    skritter.storage.get('decomps', strokeWritings, function(decomps) {
                        if (strokeWritings.length === decomps.length) {
                            callback(null, item, vocab, containedItems, containedVocabs, sentence, strokes, skritter.user.data.decomps.add(decomps, {merge: true, silent: true}));
                        } else {
                            callback(null, item, vocab, containedItems, containedVocabs, sentence, strokes, null);
                        }
                    });
                }
            ], function(error, item, vocab, containedItems, containedVocabs, sentence, strokes, decomps) {
                if (error) {
                    console.log('unable to load', item.id, item, error);
                    skritter.user.scheduler.remove(item.id);
                    callback();
                } else {
                    callback(item, vocab, containedItems, containedVocabs, sentence, strokes, decomps);
                }
            });
        },
        /**
         * @method loadVocab
         * @param {String} vocabId
         * @param {Function} callback
         */
        loadVocab: function(vocabId, callback) {
            async.waterfall([
                //intial vocab
                function(callback) {
                    skritter.storage.get('vocabs', vocabId, function(vocabs) {
                        if (vocabs.length > 0) {
                            callback(null, skritter.user.data.vocabs.add(vocabs[0], {merge: true, silent: true}));
                        } else {
                            callback("Initial vocab is missing.");
                        }
                    });
                },
                //contained vocabs
                function(vocab, callback) {
                    var containedVocabIds = vocab.get('containedVocabIds');
                    if (containedVocabIds && containedVocabIds.length > 0) {
                        skritter.storage.get('vocabs', containedVocabIds, function(containedVocabs) {
                            if (containedVocabIds.length === containedVocabs.length) {
                                callback(null, vocab, skritter.user.data.vocabs.add(containedVocabs, {merge: true, silent: true, sort: false}));
                            } else {
                                callback("One or more of the contained vocabs is missing.", vocab);
                            }
                        });
                    } else {
                        callback(null, vocab, []);
                    }
                },
                //sentence
                function(vocab, containedVocabs, callback) {
                    if (vocab.has('sentenceId')) {
                        skritter.storage.get('sentences', vocab.get('sentenceId'), function(sentences) {
                            if (sentences.length > 0) {
                                callback(null, vocab, containedVocabs, skritter.user.data.sentences.add(sentences, {merge: true, silent: true}));
                            } else {
                                callback(null, vocab, containedVocabs, null);
                            }
                        });
                    } else {
                        callback(null, vocab, containedVocabs, null);
                    }
                },
                //decomps
                function(vocab, containedVocabs, sentence, callback) {
                    var characters = vocab.getCharacters();
                    skritter.storage.get('decomps', characters, function(decomps) {
                        if (characters.length === decomps.length) {
                            callback(null, vocab, containedVocabs, sentence, skritter.user.data.decomps.add(decomps, {merge: true, silent: true}));
                        } else {
                            callback(null, vocab, containedVocabs, sentence, null);
                        }
                    });
                }
            ], function(error, vocab, containedVocabs, sentence, decomps) {
                if (error) {
                    callback();
                } else {
                    callback(vocab, containedVocabs, sentence, decomps);
                }
            });
        },
        /**
         * @method put
         * @param {Object} result
         * @param {Function} callback
         */
        put: function(result, callback) {
            async.series([
                function(callback) {
                    skritter.user.data.decomps.insert(result.Decomps, callback);
                },
                function(callback) {
                    skritter.user.data.items.insert(result.Items, callback);
                },
                function(callback) {
                    skritter.user.data.sentences.insert(result.Sentences, callback);
                },
                function(callback) {
                    skritter.user.data.srsconfigs.insert(result.SRSConfigs, callback);
                },
                function(callback) {
                    skritter.user.data.strokes.insert(result.Strokes, callback);
                },
                function(callback) {
                    skritter.user.data.vocablists.insert(result.VocabLists, callback);
                },
                function(callback) {
                    skritter.user.data.vocabs.insert(result.Vocabs, callback);
                }
            ], function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method reset
         * @return {Backbone.Model}
         */
        reset: function() {
            this.decomps.reset();
            this.items.reset();
            this.sentences.reset();
            this.strokes.reset();
            this.vocabs.reset();
            return this;
        }
    });

    return Model;
});