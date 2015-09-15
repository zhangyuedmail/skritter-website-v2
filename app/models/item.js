var SkritterModel = require('base/skritter-model');
var PromptReviews = require('collections/prompt-reviews');
var PromptReview = require('models/prompt-review');

/**
 * @class Item
 * @extends {SkritterModel}
 */
module.exports = SkritterModel.extend({
    /**
     * @property idAttribute
     * @type {String}
     */
    idAttribute: 'id',
    /**
     * @property urlRoot
     * @type {String}
     */
    urlRoot: 'items',
    /**
     * @method getBase
     * @returns {String}
     */
    getBase: function() {
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
            if (this.collection.contained.get(intendedId)) {
                containedItems.push(this.collection.contained.get(intendedId));
            } else {
                containedItems.push(this.collection.contained.get(fallbackId));
            }
        }
        return _.includes(['rune', 'tone'], part) ? containedItems : [];
    },
    /**
     * @method getContainedVocabs
     * @returns {Array}
     */
    getContainedVocabs: function() {
        var containedVocabs = [];
        var containedVocabIds = this.getVocab().get('containedVocabIds') || [];
        for (var i = 0, length = containedVocabIds.length; i < length; i++) {
            containedVocabs.push(this.collection.vocabs.get(containedVocabIds[i]));
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
        switch (part) {
            case 'rune':
                characters = vocab.getPromptCharacters();
                items = containedItems.length ? containedItems : [this];
                vocabs = containedVocabs.length ? containedVocabs : [vocab];
                break;
            case 'tone':
                characters = vocab.getPromptTones();
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
            review.item = items[i];
            review.vocab = vocabs[i];
            reviews.add(review);
        }
        reviews.group = Date.now() + '_' + this.id;
        reviews.item = this;
        reviews.part = part;
        reviews.vocab = vocab;
        return reviews;
    },
    /**
     * @method getVariation
     * @returns {Number}
     */
    getVariation: function() {
        return parseInt(this.id.split('-')[3], 10);
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
        var reviewSimplified = app.user.get('reviewSimplified');
        var reviewTraditional = app.user.get('reviewTraditional');
        for (var i = 0, length = vocabIds.length; i < length; i++) {
            var vocab = this.collection.vocabs.get(vocabIds[i]);
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
        return vocabs;
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
    },
    /**
     * @method parse
     * @param {Object} response
     * @returns {Object}
     */
    parse: function(response) {
        return response.Item || response;
    }
});
