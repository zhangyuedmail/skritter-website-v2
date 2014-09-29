/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class ScheduleItem
     * @extends BaseModel
     */
    var ScheduleItem = BaseModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            interval: 0,
            last: 0,
            next: 0,
            part: undefined,
            reviews: 0,
            style: undefined,
            successes: 0,
            vocabIds: []
        },
        /**
         * @method getReadiness
         * @param {Number} time
         * @returns {Number}
         */
        getReadiness: function(time) {
            var now = time || moment().unix();
            var timePast =  now - this.attributes.last;
            var timeInterval = 0;
            if (this.attributes.interval) {
                timeInterval = (this.attributes.last + this.attributes.interval)  - this.attributes.last
            } else {
                timeInterval = this.attributes.next  - this.attributes.last
            }
            if (this.attributes.part === 'rune') {
                timePast += 2;
            }
            if (this.attributes.part === 'tone') {
                timePast += 1;
            }
            return timePast / timeInterval;
        },
        /**
         * @method isNew
         * @returns {Boolean}
         */
        isNew: function() {
            return this.attributes.reviews === 0;
        },
        /**
         * @method load
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        load: function(callbackSuccess, callbackError) {
            var self = this;
            var part = self.get('part');
            var result = {};
            async.series([
                //initial item
                function(callback) {
                    app.storage.getItems('items', self.id, function(items) {
                        if (items.length > 0) {
                            result.item = app.user.data.items.add(items[0], {merge: true, silent: true, sort: false});
                            callback();
                        } else {
                            callback('Initial item is missing.');
                        }
                    });
                },
                //initial vocab
                function(callback) {
                    app.storage.getItems('vocabs', result.item.get('vocabIds'), function(vocabs) {
                        if (vocabs.length > 0) {
                            app.user.data.vocabs.add(vocabs, {merge: true, silent: true, sort: false});
                            result.vocab = result.item.getVocab();
                            callback();
                        } else {
                            callback('Initial vocabs are missing.');
                        }
                    });
                },
                //contained items
                function(callback) {
                    if (part === 'rune' || part === 'tone') {
                        var containedItemIds = result.vocab.getContainedItemIds(part);
                        var containedItemCount = containedItemIds.length;
                        app.storage.getItems('items', containedItemIds, function(containedItems) {
                            if (containedItemCount === containedItems.length) {
                                result.containedItems = app.user.data.items.add(containedItems, {merge: true, silent: true, sort: false});
                                callback();
                            } else {
                                callback('One or more of the contained items is missing.');
                            }
                        });
                    } else {
                        result.containedItems = [];
                        callback();
                    }
                },
                //contained vocabs
                function(callback) {
                    var containedVocabIds = result.vocab.has('containedVocabIds') ? result.vocab.get('containedVocabIds') : [];
                    if (part === 'rune' || part === 'tone') {
                        app.storage.getItems('vocabs', containedVocabIds, function(containedVocabs) {
                            if (containedVocabIds.length === containedVocabs.length) {
                                result.containedVocabs = app.user.data.vocabs.add(containedVocabs, {merge: true, silent: true, sort: false});
                                callback();
                            } else {
                                callback('One or more of the contained vocabs is missing.');
                            }
                        });
                    } else {
                        result.containedVocabs = [];
                        callback();
                    }
                },
                //sentences
                function(callback) {
                    if (result.vocab.has('sentenceId')) {
                        app.storage.getItems('sentences', result.vocab.get('sentenceId'), function(sentences) {
                            if (sentences.length > 0) {
                                result.sentences = app.user.data.sentences.add(sentences, {merge: true, silent: true, sort: false});
                                callback();
                            } else {
                                callback('Sentence is missing.');
                            }
                        });
                    } else {
                        result.sentences = [];
                        callback();
                    }
                },
                //strokes
                function(callback) {
                    if (part === 'rune') {
                        var strokeWritings = null;
                        if (result.containedVocabs.length === 0) {
                            strokeWritings = result.vocab.get('writing');
                        } else {
                            strokeWritings = _.pluck(result.containedVocabs, function(vocab) {
                                return vocab.attributes.writing;
                            });
                        }
                        app.storage.getItems('strokes', strokeWritings, function(strokes) {
                            if (strokeWritings.length === strokes.length) {
                                result.strokes = app.user.data.strokes.add(strokes, {merge: true, silent: true, sort: false});
                                callback();
                            } else {
                                callback('One or more of the strokes are missing.');
                            }
                        });
                    } else {
                        result.strokes = [];
                        callback();
                    }
                },
                //decomps
                function(callback) {
                    var strokeWritings = null;
                    if (result.containedVocabs.length === 0) {
                        strokeWritings = result.vocab.get('writing');
                    } else {
                        strokeWritings = _.pluck(result.containedVocabs, function(vocab) {
                            return vocab.attributes.writing;
                        });
                    }
                    app.storage.getItems('decomps', strokeWritings, function(decomps) {
                        if (strokeWritings.length === decomps.length) {
                            result.decomps = app.user.data.decomps.add(decomps, {merge: true, silent: true, sort: false});
                            callback();
                        } else {
                            result.decomps = [];
                            callback();
                        }
                    });
                }
            ], function(error) {
                if (error) {
                    if (result.item) {
                        self.set({vocabIds: [], flag: error ? error : 'Unable to load item.'});
                    }
                    console.error('SCHEDULE ERROR:', error, self);
                    callbackError(error);
                } else {
                    callbackSuccess(result);
                }
            });
        }
    });

    return ScheduleItem;
});