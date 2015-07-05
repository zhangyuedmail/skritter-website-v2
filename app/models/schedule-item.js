var GelatoModel = require('gelato/modules/model');
var PromptReviews = require('collections/prompt-reviews');
var PromptReview = require('models/prompt-review');

/**
 * @class HistoryItem
 * @extends {GelatoModel}
 */
module.exports = GelatoModel.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {},
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
        if (this.get('vocabIds').length) {
            var itemLast = this.get('last') || 0;
            var itemNext = this.get('next') || 0;
            var actualAgo = now - itemLast;
            var scheduledAgo = itemNext - itemLast;
            return itemLast ? actualAgo / scheduledAgo : 9999;
        }
        return 0;
    },
    /**
     * @method getVocab
     * @returns {DataVocab}
     */
    getVocab: function() {
        var vocabs = this.getVocabs();
        if (app.isChinese()) {
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
            vocabs.push(app.user.data.vocabs.get(vocabIds[i]));
        }
        return _.without(vocabs, undefined);
    }
});
