/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoModel',
    'modules/collections/PromptReviews',
    'modules/models/PromptReview'
], function(GelatoModel, PromptReviews, PromptReview) {

    /**
     * @class DataItem
     * @extends GelatoModel
     */
    var DataItem = GelatoModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.containedItems = [];
            this.containedVocabs = [];
            this.decomps = [];
            this.readiness = 0;
            this.sentences = [];
            this.strokes = [];
            this.vocabs = [];
        },
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @method defaults
         * @returns {Object}
         */
        defaults: function() {
            return {
                vocabIds: []
            };
        },
        /**
         * @method cache
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        cache: function(callbackSuccess, callbackError) {
            app.user.data.storage.put('items', this.toJSON(), function() {
                if (typeof callbackSuccess === 'function') {
                    callbackSuccess();
                }
            }, function(error) {
                if (typeof callbackError === 'function') {
                    callbackError(error);
                }
            });
        },
        /**
         * @method getCharacters
         * @returns {Array}
         */
        getCharacters: function() {
            return this.getVocab().get('writing').split('');
        },
        /**
         * @method getPromptReviews
         * @returns {PromptReviews}
         */
        getPromptReviews: function() {
            var reviews = new PromptReviews();
            var part = this.get('part');
            var vocab = this.getVocab();
            var characters = [];
            var items = [];
            var vocabs = [];
            if (['rune', 'tone'].indexOf(part) > -1) {
                characters = (part === 'tone') ? vocab.getCanvasTones() : vocab.getCanvasCharacters();
                items = this.containedItems.length ? this.containedItems : [this];
                vocabs = this.containedVocabs.length ? this.containedVocabs : [vocab];
            } else {
                items = [this];
                vocabs = [vocab];
            }
            for (var i = 0, length = vocabs.length; i < length; i++) {
                var review = new PromptReview();
                review.character = characters[i];
                review.item = items[i].toJSON();
                review.vocab = vocabs[i];
                reviews.add(review);
            }
            reviews.group = Date.now() + '_' + this.id;
            reviews.item = this.toJSON();
            reviews.part = part;
            reviews.vocab = vocab;
            return reviews;
        },
        /**
         * @method getReadiness
         * @returns {Number}
         */
        getReadiness: function() {
            if (this.get('vocabIds').length) {
                var actualAgo = Moment().unix() - this.get('last');
                var scheduledAgo = this.get('next') - this.get('last');
                this.readiness = actualAgo / scheduledAgo;
            } else {
                this.readiness = 0;
            }
            return this.readiness;
        },
        /**
         * @method getVocab
         * @returns {DataVocab}
         */
        getVocab: function() {
            var vocabs = this.vocabs;
            if (app.user.isChinese()) {
                return vocabs[this.get('reviews') % vocabs.length];
            }
            return vocabs[0];
        },
        /**
         * @method isNew
         * @returns {Boolean}
         */
        isNew: function() {
            return this.get('reviews') ? false : true;
        },
        /**
         * @method isValid
         * @returns {Boolean}
         */
        isValid: function() {
            //filter out any items not loaded yet
            if (this.get('changed') === undefined) {
                return false;
            }
            //filter out items that contain no vocab ids
            if (!this.get('vocabIds').length) {
                return false;
            }
            //filter out items not matching an active part
            if (this.collection.activeParts.indexOf(this.get('part')) === -1) {
                return false;
            }
            //chinese specific filters
            if (this.collection.languageCode === 'zh') {
                //filter out items not matching an active style
                if (this.collection.activeStyles.indexOf(this.get('style')) === -1) {
                    return false;
                }
            }
            //japanese specific filters
            if (this.collection.languageCode === 'ja') {
                //TODO: add japanese specific kana filters
            }
            return true;
        },
        /**
         * @method load
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        load: function(callbackSuccess, callbackError) {
            var self = this;
            var options = {merge: true, silent: true, sort: false};
            var part = this.get('part');
            var userId = app.user.id;
            var vocabIds = this.get('vocabIds');
            //TODO: first check if item is valid
            Async.series([
                //vocabs
                function(callback) {
                    app.user.data.storage.get('vocabs', vocabIds, function(result) {
                        self.vocabs = app.user.data.vocabs.add(result, options);
                        callback();
                    }, function() {
                        callback(new Error('Unable to load vocabs.'));
                    });
                },
                //contained items
                function(callback) {
                    var containedVocabIds = self.getVocab().get('containedVocabIds');
                    if (containedVocabIds && part !== 'defn') {
                        var contained = [];
                        for (var i = 0, length = containedVocabIds.length; i < length; i++) {
                            var splitId = containedVocabIds[i].split('-');
                            var fallbackId = [userId, splitId[0], splitId[1], 0, part].join('-');
                            var intendedId = [userId, containedVocabIds[i], part].join('-');
                            if (self.collection.get(intendedId)) {
                                contained.push(self.collection.get(intendedId));
                            } else if (self.collection.get(fallbackId)) {
                                contained.push(self.collection.get(fallbackId));
                            } else {
                                callback(new Error('Unable to load contained items.'));
                                return;
                            }
                        }
                        self.containedItems = contained;
                        callback();
                    } else {
                        callback();
                    }
                },
                //contained vocabs
                function(callback) {
                    var containedVocabIds = self.getVocab().getContainedVocabIds();
                    app.user.data.storage.get('vocabs', containedVocabIds, function(result) {
                        self.containedVocabs = app.user.data.vocabs.add(result, options);
                        callback();
                    }, function() {
                        callback(new Error('Unable to load contained vocabs.'));
                    });
                },
                //strokes
                function(callback) {
                    app.user.data.storage.get('strokes', self.getCharacters(), function(result) {
                        self.strokes = app.user.data.strokes.add(result, options);
                        callback();
                    }, function() {
                        callback(new Error('Unable to load strokes.'));
                    });
                },
                //decomps
                function(callback) {
                    app.user.data.storage.get('decomps', self.getCharacters(), function(result) {
                        self.decomps = app.user.data.decomps.add(result, options);
                        callback();
                    }, function() {
                        callback(new Error('Unable to load decomps.'));
                    });
                },
                //sentences
                function(callback) {
                    var sentenceId = self.getVocab().get('sentenceId') || [];
                    app.user.data.storage.get('sentences', sentenceId, function(result) {
                        self.sentences = app.user.data.sentences.add(result, options);
                        callback();
                    }, function() {
                        callback(new Error('Unable to load sentences.'));
                    });
                }
            ], function(error) {
                if (error) {
                    callbackError(error);
                } else {
                    callbackSuccess(self);
                }
            });
        }
    });

    return DataItem;

});