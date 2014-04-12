/**
 * @module Skritter
 * @submodule Models
 * @param Decomps
 * @param Items
 * @param Reviews
 * @param Sentences
 * @param SRSConfigs
 * @param Strokes
 * @param VocabLists
 * @param Vocabs
 * @author Joshua McFarland
 */
define([
    'collections/data/Decomps',
    'collections/data/Items',
    'collections/data/Reviews',
    'collections/data/Sentences',
    'collections/data/SRSConfigs',
    'collections/data/Strokes',
    'collections/data/VocabLists',
    'collections/data/Vocabs'
], function(Decomps, Items, Reviews, Sentences, SRSConfigs, Strokes, VocabLists, Vocabs) {
    /**
     * @class UserData
     */
    var Data = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Data.syncing = false;
            this.decomps = new Decomps();
            this.items = new Items();
            this.reviews = new Reviews();
            this.sentences = new Sentences();
            this.srsconfigs = new SRSConfigs();
            this.strokes = new Strokes();
            this.vocablists = new VocabLists();
            this.vocabs = new Vocabs();
            this.on('change', this.cache);
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            lastItemSync: 0,
            lastVocabSync: 0
        },
        /**
         * @method cache
         * @param {Object} event
         */
        cache: function(event) {
            localStorage.setItem(skritter.user.id + '-data', JSON.stringify(event.toJSON()));
        },
        /**
         * @method add
         * @param {Object} data
         * @param {Object} options
         */
        add: function(data, options) {
            this.decomps.add(data.Decomps, options);
            this.items.add(data.Items, options);
            this.sentences.add(data.Sentences, options);
            this.srsconfigs.add(data.SRSConfigs, options);
            this.strokes.add(data.Strokes, options);
            this.vocablists.add(data.VocabLists, options);
            this.vocabs.add(data.Vocabs, options);
        },
        /**
         * @method clear
         * @returns {Backbone.Model}
         */
        clear: function() {
            this.decomps.reset();
            this.items.reset();
            this.sentences.reset();
            this.strokes.reset();
            this.vocabs.reset();
            return this;
        },
        /**
         * @method fetchItems
         * @param {Number} offset
         * @param {Function} callback1
         * @param {Function} callback2
         */
        fetchItems: function(offset, callback1, callback2) {
            async.waterfall([
                function(callback) {
                    skritter.api.requestBatch([{
                            path: 'api/v' + skritter.api.get('version') + '/items',
                            method: 'GET',
                            params: {
                                lang: skritter.settings.language(),
                                sort: 'changed',
                                offset: offset,
                                include_vocabs: 'true',
                                include_strokes: 'true',
                                include_sentences: 'true',
                                include_heisigs: 'true',
                                include_top_mnemonics: 'true',
                                include_decomps: 'true'
                            },
                            spawner: true
                        }], function(batch) {
                        
                        if (batch.statusText === 'error') {
                            callback(batch, null);
                        } else {
                            callback(null, batch);
                        }
                    });
                },
                function(batch, callback) {
                    var next = function() {
                        skritter.api.getBatch(batch.id, function(result) {
                            if (result) {
                                if (typeof callback2 === 'function')
                                    callback2(result);
                                async.series([
                                    function(callback) {
                                        skritter.storage.put('decomps', result.Decomps, callback);
                                    },
                                    function(callback) {
                                        skritter.storage.put('items', result.Items, callback);
                                    },
                                    function(callback) {
                                        skritter.storage.put('sentences', result.Sentences, callback);
                                    },
                                    function(callback) {
                                        skritter.storage.put('strokes', result.Strokes, callback);
                                    },
                                    function(callback) {
                                        skritter.storage.put('vocabs', result.Vocabs, callback);
                                    }
                                ], function() {
                                    window.setTimeout(next, 500);
                                });
                            } else {
                                callback();
                            }
                        });
                    };
                    next();
                }
            ], function() {
                if (typeof callback1 === 'function')
                    callback1();
            });
        },
        /**
         * @method fetchSRSConfigs
         * @param {Function} callback
         */
        fetchSRSConfigs: function(callback) {
            skritter.api.getSRSConfigs(skritter.settings.language(), function(srsconfigs) {
                if (srsconfigs.statusText === 'error') {
                    callback();
                } else {
                    skritter.storage.put('srsconfigs', srsconfigs, callback);
                }
            });
        },
        /**
         * @method fetchSRSConfigs
         * @param {Number} offset
         * @param {Function} callback1
         * @param {Function} callback2
         */
        fetchVocabs: function(offset, callback1, callback2) {
            async.waterfall([
                function(callback) {
                    skritter.api.requestBatch([{
                            path: 'api/v' + skritter.api.get('version') + '/vocabs',
                            method: 'GET',
                            params: {
                                lang: skritter.settings.language(),
                                sort: 'all',
                                offset: offset,
                                include_strokes: 'true',
                                include_sentences: 'true',
                                include_heisigs: 'true',
                                include_top_mnemonics: 'true',
                                include_decomps: 'true'
                            },
                            spawner: true
                        }], function(batch) {
                        if (batch.statusText === 'error') {
                            callback(batch, null);
                        } else {
                            callback(null, batch);
                        }
                    });
                },
                function(batch, callback) {
                    var next = function() {
                        skritter.api.getBatch(batch.id, function(result) {
                            if (result) {
                                if (typeof callback2 === 'function')
                                    callback2(result);
                                skritter.storage.put('vocabs', result.Vocabs, function() {
                                    window.setTimeout(next, 500);
                                });
                            } else {
                                callback();
                            }
                        });
                    };
                    next();
                }
            ], function() {
                if (typeof callback1 === 'function')
                    callback1();
            });
        },
        /**
         * @method fetchVocabLists
         * @param {Function} callback
         */
        fetchVocabLists: function(callback) {
            skritter.api.getVocabLists(skritter.settings.language(), 'studying', null, function(lists) {
                skritter.storage.put('vocablists', lists, callback);
            });
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            async.series([
                function(callback) {
                    self.decomps.loadAll(callback);
                },
                function(callback) {
                    self.items.loadAll(callback);
                },
                function(callback) {
                    self.reviews.loadAll(callback);
                },
                function(callback) {
                    self.sentences.loadAll(callback);
                },
                function(callback) {
                    self.srsconfigs.loadAll(callback);
                },
                function(callback) {
                    self.strokes.loadAll(callback);
                },
                function(callback) {
                    self.vocablists.loadAll(callback);
                },
                function(callback) {
                    self.vocabs.loadAll(callback);
                }
            ], function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method loadItem
         * @param {String} itemId
         * @param {Function} callback
         */
        loadItem: function(itemId, callback) {
            this.clear();
            var part = itemId.split('-')[4];
            async.waterfall([
                //intial item
                function(callback) {
                    skritter.storage.get('items', itemId, function(item) {
                        if (item.length > 0) {
                            callback(null, skritter.user.data.items.add(item[0], {merge: true, silent: true}));
                        } else {
                            callback("Initial item is missing.");
                        }
                    });
                },
                //intial vocab
                function(item, callback) {
                    skritter.storage.get('vocabs', item.vocabId(), function(vocab) {
                        if (vocab.length > 0) {
                            callback(null, item, skritter.user.data.vocabs.add(vocab[0], {merge: true, silent: true}));
                        } else {
                            callback("Initial vocab is missing.", item);
                        }
                    });
                },
                //contained items
                function(item, vocab, callback) {
                    if (part === 'rune' || part === 'tone') {
                        var containedItemIds = vocab.containedItemIds(part);
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
                    if (containedItems) {
                        var containedVocabIds = [];
                        for (var i = 0, length = containedItems.length; i < length; i++)
                            containedVocabIds.push(containedItems[i].vocabId());
                        var containedVocabCount = containedVocabIds.length;
                        skritter.storage.get('vocabs', containedVocabIds, function(containedVocabs) {
                            if (containedVocabCount === containedVocabs.length) {
                                callback(null, item, vocab, containedItems, skritter.user.data.vocabs.add(containedVocabs, {merge: true, silent: true}));
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
                            if (sentences.length === 1) {
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
                        var writings = [];
                        if (containedVocabs.length === 0) {
                            writings.push(vocab.get('writing'));
                        } else {
                            for (var i = 0, length = containedVocabs.length; i < length; i++)
                                writings.push(containedVocabs[i].get('writing'));
                        }
                        var writingsCount = writings.length;
                        skritter.storage.get('strokes', writings, function(strokes) {
                            if (writingsCount === strokes.length) {
                                callback(null, item, vocab, containedItems, containedVocabs, sentence, skritter.user.data.strokes.add(strokes, {merge: true, silent: true}));
                            } else {
                                callback("One or more of the strokes are missing.", item);
                            }
                        });
                    } else {
                        callback(null, item, vocab, containedItems, containedVocabs, sentence, []);
                    }
                }
            ], function(error, item) {
                if (error) {
                    console.log('ITEM ERROR', item, error);
                    if (item)
                        item.set({
                            flag: 'true',
                            flagMessage: error
                        });
                    callback();
                } else {
                    if (item.has('flag')) {
                        item.unset('flag');
                        item.unset('flagMessage');
                    }
                    callback(item);
                }
            });
        },
        /**
         * @method loadVocab
         * @param {String} vocabId
         * @param {Function} callback
         */
        loadVocab: function(vocabId, callback) {
            async.series([
                function(callback) {
                    if (skritter.user.data.vocabs.get(vocabId)) {
                        callback(skritter.user.data.vocabs.get(vocabId));
                    } else {
                        callback();
                    }
                },
                function(callback) {
                    skritter.storage.get('vocabs', vocabId, function(vocab) {
                        if (vocab.length > 0) {
                            callback(vocab[0]);
                        } else {
                            callback();
                        }
                    });
                }
            ], function(vocab) {
                if (vocab.sentenceId) {
                    async.series([
                        function(callback) {
                            if (skritter.user.data.sentences.get(vocab.sentenceId)) {
                                callback(skritter.user.data.sentences.get(vocab.sentenceId));
                            } else {
                                callback();
                            }
                        },
                        function(callback) {
                            skritter.storage.get('sentences', vocab.sentenceId, function(sentence) {
                                if (sentence.length > 0) {
                                    callback(sentence);
                                } else {
                                    callback();
                                }
                            });
                        }
                    ], function(sentence) {
                        skritter.user.data.sentences.add(sentence, {merge: true, silent: true});
                        callback(skritter.user.data.vocabs.add(vocab, {merge: true, silent: true}));
                    });
                } else {
                    callback(skritter.user.data.vocabs.add(vocab, {merge: true, silent: true}));
                }
            });
        },
        /**
         * @method redownload
         * @param {Function} callback
         */
        redownload: function(callback) {
            async.series([
                function(callback) {
                    skritter.storage.destroy(callback);
                },
                function(callback) {
                    skritter.storage.open(skritter.user.get('user_id'), callback);
                },
                function() {
                    skritter.user.data.sync(callback, true, true);
                }
            ], function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method sync
         * @param {Function} callback
         * @param {Boolean} showModal
         * @param {Boolean} forceDownload
         */
        sync: function(callback, showModal, forceDownload) {
            var self = this;
            var downloadedRequests = 0;
            var lastItemSync = forceDownload ? 0 : this.get('lastItemSync');
            var lastVocabSync = forceDownload ? 0 : this.get('lastVocabSync');
            var now = skritter.fn.getUnixTime();
            var responseSize = 0;
            Data.syncing = true;
            console.log('SYNCING FROM', (lastItemSync === 0) ? 'THE BEGINNING OF TIME' : moment(lastItemSync * 1000).format('YYYY-MM-DD H:mm:ss'));
            if (showModal || lastItemSync === 0) {
                skritter.modals.show('download')
                        .set('.modal-title', lastItemSync === 0 ? 'INITIAL SYNC' : 'SYNC')
                        .set('.modal-title-right', 'Getting Items')
                        .progress(100)
                        .set('.modal-footer', false);
            } else {
                if (typeof callback === 'function')
                    callback();
            }
            async.series([
                //downloads all of the changed items and related data since last sync
                function(callback) {
                    self.fetchItems(lastItemSync, callback, function(result) {
                        downloadedRequests += result.downloadedRequests;
                        responseSize += result.responseSize;
                        if (responseSize > 0)
                            skritter.modals.set('.modal-title-right', skritter.fn.bytesToSize(responseSize));
                        if (result.totalRequests > 10 && result.runningRequests === 0)
                            skritter.modals.progress((downloadedRequests / result.totalRequests) * 100);
                    });
                },
                //downloads vocab lists currently being studied on intial sync
                function(callback) {
                    if (lastItemSync === 0) {
                        skritter.modals.set('.modal-title-right', 'Getting Lists');
                        self.fetchVocabLists(callback);
                    } else {
                        callback();
                    }
                },
                //downloads changed vocabs at a maximum of once per day
                function(callback) {
                    if (lastVocabSync !== 0 &&  moment(lastVocabSync * 1000).add('days', 1).valueOf() / 1000 <= now) {
                        skritter.modals.set('.modal-title-right', 'Updating Vocabs');
                        self.fetchVocabs(lastVocabSync, callback, null);
                    } else {
                        callback();
                    }
                },
                //downloads the latest configs for more accurate scheduling
                function(callback) {
                    skritter.modals.set('.modal-title-right', 'Updating SRS');
                    self.fetchSRSConfigs(callback);
                },
                //checks the server for review errors from last successful sync
                function(callback) {
                    if (lastItemSync === 0) {
                        callback();
                    } else {
                        skritter.user.reviewErrors(lastItemSync, callback);
                    }
                },
                //posts stores reviews to the server
                function(callback) {
                    if (skritter.user.data.reviews.length > 0) {
                        skritter.modals.set('.modal-title-right', 'Posting Reviews');
                        skritter.user.data.reviews.post(callback);
                    } else {
                        callback();
                    }
                }
            ], function() {
                console.log('FINISHED SYNCING AT', moment(now * 1000).format('YYYY-MM-DD H:mm:ss'));
                if (showModal || lastItemSync === 0) {
                    skritter.modals.hide(function() {
                        if (typeof callback === 'function')
                            callback();
                    });
                }
                self.set('lastItemSync', now);
                self.set('lastVocabSync', now);
                Data.syncing = false;
            });
        },
        /**
         * @method total
         * @returns {Number}
         */
        total: function() {
            var total = this.decomps.length;
            total += this.items.length;
            total += this.reviews.length;
            total += this.sentences.length;
            total += this.strokes.length;
            total += this.vocablists.length;
            return total + this.vocabs.length;
        }
    });

    return Data;
});