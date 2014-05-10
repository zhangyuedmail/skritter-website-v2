/**
 * @module Skritter
 * @submodule Collections
 * @param Item
 * @author Joshua McFarland
 */
define([
    'model/data/Item'
], function(Item) {
    /**
     * @class DataItems
     */
    var Items = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Item,
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('items', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method insert
         * @param {Array|Object} items
         * @param {Function} callback
         */
        insert: function(items, callback) {
            skritter.storage.put('items', items, callback);
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('items', _.bind(function(items) {
                self.add(items, {merge: true, silent: true, sort: false});
                callback();
            }, this));
        },
        /**
         * @method loadItem
         * @param {String} itemId
         * @param {Function} callback
         */
        loadItem: function(itemId, callback) {
            var part = itemId.split('-')[4];
            skritter.user.data.clear();
            async.waterfall([
                //intial item
                function(callback) {
                    skritter.storage.get('items', itemId, function(item) {
                        if (item.length > 0) {
                            callback(null, skritter.user.data.items.add(item[0], {merge: true, silent: true, sort: false}));
                        } else {
                            callback("Initial item is missing.");
                        }
                    });
                },
                //intial vocab
                function(item, callback) {
                    skritter.storage.get('vocabs', item.getVocabId(), function(vocab) {
                        if (vocab.length > 0) {
                            callback(null, item, skritter.user.data.vocabs.add(vocab[0], {merge: true, silent: true, sort: false}));
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
                                callback(null, item, vocab, skritter.user.data.items.add(containedItems, {merge: true, silent: true, sort: false}));
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
                            containedVocabIds.push(containedItems[i].getVocabId());
                        var containedVocabCount = containedVocabIds.length;
                        skritter.storage.get('vocabs', containedVocabIds, function(containedVocabs) {
                            if (containedVocabCount === containedVocabs.length) {
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
                            if (sentences.length === 1) {
                                callback(null, item, vocab, containedItems, containedVocabs, skritter.user.data.sentences.add(sentences, {merge: true, silent: true, sort: false}));
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
                                callback(null, item, vocab, containedItems, containedVocabs, sentence, skritter.user.data.strokes.add(strokes, {merge: true, silent: true, sort: false}));
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
                    skritter.user.scheduler.remove(item.id);
                    item.cache(callback);
                } else {
                    if (item.has('flag')) {
                        item.unset('flag');
                        item.unset('flagMessage');
                    }
                    callback(item);
                }
            });
        }
    });

    return Items;
});