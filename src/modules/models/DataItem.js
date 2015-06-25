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
         * @method getCharacters
         * @returns {Array}
         */
        getCharacters: function() {
            return this.getVocab().get('writing').split('');
        },
        /**
         * @method getContainedItems
         * @returns {Array}
         */
        getContainedItems: function() {
            var containedItems = [];
            var containedVocabIds = [];
            var part = this.get('part');
            if (this.get('part') !== 'defn') {
                containedVocabIds = this.getVocab().getContainedVocabIds();
            }
            for (var i = 0, length = containedVocabIds.length; i < length; i++) {
                var splitId = containedVocabIds[i].split('-');
                var fallbackId = [app.user.id, splitId[0], splitId[1], 0, part].join('-');
                var intendedId = [app.user.id, containedVocabIds[i], part].join('-');
                if (app.user.data.items.get(intendedId)) {
                    containedItems.push(app.user.data.items.get(intendedId));
                } else if (app.user.data.items.get(fallbackId)) {
                    containedItems.push(app.user.data.items.get(fallbackId));
                } else {
                    console.error(new Error('Unable to get contained items.'));
                }
            }
            return containedItems;
        },
        /**
         * @method getContainedVocabs
         * @returns {Array}
         */
        getContainedVocabs: function() {
            var containedVocabs = [];
            var containedVocabIds = this.getVocab().getContainedVocabIds();
            for (var i = 0, length = containedVocabIds.length; i < length; i++) {
                var containedVocab = app.user.data.vocabs.get(containedVocabIds[i]);
                if (containedVocab) {
                    containedVocabs.push(containedVocab);
                }
            }
            return containedVocabs;
        },
        /**
         * @method getPromptReviews
         * @returns {PromptReviews}
         */
        getPromptReviews: function() {
            var reviews = new PromptReviews();
            var containedItems = this.getContainedItems();
            var containedVocabs = this.getContainedVocabs();
            var part = this.get('part');
            var vocab = this.getVocab();
            var characters = [];
            var items = [];
            var vocabs = [];
            if (['defn', 'rdng'].indexOf(part) > -1) {
                items = [this];
                vocabs = [vocab];
            } else {
                characters = (part === 'tone') ? vocab.getCanvasTones() : vocab.getCanvasCharacters();
                items = containedItems.length ? containedItems : [this];
                vocabs = containedVocabs.length ? containedVocabs : [vocab];
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
         * @param {Number} now
         * @returns {Number}
         */
        getReadiness: function(now) {
            if (this.get('vocabIds').length) {
                var itemLast = this.get('last') || 0;
                var itemNext = this.get('next') || 0;
                var actualAgo = now - itemLast;
                var scheduledAgo = itemNext - itemLast;
                if (!itemLast) {
                    return 9999;
                }
                return actualAgo / scheduledAgo;
            }
            return 0;
        },
        /**
         * @method getVocab
         * @returns {DataVocab}
         */
        getVocab: function() {
            var vocabs = this.getVocabs();
            if (app.user.isChinese()) {
                return vocabs[this.get('reviews') % vocabs.length];
            }
            return vocabs[0];
        },
        /**
         * @method getVocabs
         * @returns {Array}
         */
        getVocabs: function() {
            var vocabs = [];
            var vocabIds = this.get('vocabIds');
            for (var i = 0, length = vocabIds.length; i < length; i++) {
                var vocab = app.user.data.vocabs.get(vocabIds[i]);
                if (vocab) {
                    vocabs.push(vocab);
                }
            }
            return vocabs;
        },
        /**
         * @method isNew
         * @returns {Boolean}
         */
        isNew: function() {
            return this.get('reviews') > 0;
        },
        /**
         * @method isReady
         * @returns {Boolean}
         */
        isReady: function() {
            return this.get('vocabIds').length ? true : false;
        }
    });

    return DataItem;

});