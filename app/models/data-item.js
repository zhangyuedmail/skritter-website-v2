var GelatoModel = require('gelato/model');
var PromptReviews = require('collections/prompt-reviews');
var PromptReview = require('models/prompt-review');

/**
 * @class DataItem
 * @extends {GelatoModel}
 */
module.exports = GelatoModel.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {},
    /**
     * @method getBaseWriting
     * @returns {String}
     */
    getBaseWriting: function() {
        return this.id.split('-')[2];
    },
    /**
     * @method getContainedItems
     * @returns {Array}
     */
    getContainedItems: function() {
        var containedItems = [];
        var containedVocabs = this.getContainedVocabs();
        var part = this.get('part');
        for (var i = 0, length = containedVocabs.length; i < length; i++) {
            var vocabId = containedVocabs[i].id;
            var splitId = vocabId.split('-');
            var fallbackId = [app.user.id, splitId[0], splitId[1], 0, part].join('-');
            var intendedId = [app.user.id, vocabId, part].join('-');
            if (app.user.data.items.get(intendedId)) {
                containedItems.push(app.user.data.items.get(intendedId));
            } else {
                containedItems.push(app.user.data.items.get(fallbackId));
            }
        }
        return ['rune', 'tone'].indexOf(part) > -1 ? containedItems : [];
    },
    /**
     * @method getContainedVocabs
     * @returns {Array}
     */
    getContainedVocabs: function() {
        var containedVocabs = [];
        var containedVocabIds = this.getVocab().get('containedVocabIds') || [];
        for (var i = 0, length = containedVocabIds.length; i < length; i++) {
            containedVocabs.push(app.user.data.vocabs.get(containedVocabIds[i]));
        }
        return _.without(containedVocabs, undefined);
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
        switch (part) {
            case 'rune':
                characters = vocab.getCanvasCharacters();
                items = containedItems.length ? containedItems : [this];
                vocabs = containedVocabs.length ? containedVocabs : [vocab];
                break;
            case 'tone':
                characters = vocab.getCanvasTones();
                items = containedItems.length ? containedItems : [this];
                vocabs = containedVocabs.length ? containedVocabs : [vocab];
                break;
            default:
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
     * @param {Number} now
     * @returns {Number}
     */
    getReadiness: function(now) {
        if (this.get('active')) {
            var itemLast = this.get('last') || 0;
            var itemNext = this.get('next') || 0;
            var actualAgo = now - itemLast;
            var scheduledAgo = itemNext - itemLast;
            return itemLast ? actualAgo / scheduledAgo : 9999;
        }
        return Number.NEGATIVE_INFINITY;
    },
    /**
     * @method getVocab
     * @returns {DataVocab}
     */
    getVocab: function() {
        var vocabs = this.getVocabs();
        return vocabs[this.get('reviews') % vocabs.length];
    },
    /**
     * @method getVocabs
     * @returns {Array}
     */
    getVocabs: function() {
        var vocabs = [];
        var vocabIds = this.get('vocabIds');
        var reviewSimplified = app.user.settings.get('reviewSimplified');
        var reviewTraditional = app.user.settings.get('reviewTraditional');
        for (var i = 0, length = vocabIds.length; i < length; i++) {
            var vocab = app.user.data.vocabs.get(vocabIds[i]);
            var vocabStyle = vocab.get('style');
            if (reviewSimplified && vocabStyle === 'simp') {
                vocabs.push(vocab);
            } else if (reviewTraditional && vocabStyle === 'trad') {
                vocabs.push(vocab);
            } else if (vocabStyle === 'both') {
                vocabs.push(vocab);
            } else if (vocabStyle === 'none') {
                vocabs.push(vocab);
            }
        }
        return _.without(vocabs, undefined);
    },
    /**
     * @method isChinese
     * @returns {Boolean}
     */
    isChinese: function() {
        return this.get('lang') === 'zh';
    },
    /**
     * @method isJapanese
     * @returns {Boolean}
     */
    isJapanese: function() {
        return this.get('lang') === 'ja';
    },
    /**
     * @method isNew
     * @returns {Boolean}
     */
    isNew: function() {
        return !this.get('reviews');
    }
});
