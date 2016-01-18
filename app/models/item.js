var SkritterModel = require('base/skritter-model');
var PromptItems = require('collections/prompt-items');
var PromptItem = require('models/prompt-item');

/**
 * @class Item
 * @extends {SkritterModel}
 */
module.exports = SkritterModel.extend({
    /**
     * @property consecutiveWrong
     * @type {Number}
     */
    consecutiveWrong: 0,
    /**
     * @property idAttribute
     * @type {String}
     */
    idAttribute: 'id',
    /**
     * @method parse
     * @param {Object} response
     * @returns {Object}
     */
    parse: function(response) {
        return response.Item || response;
    },
    /**
     * @property urlRoot
     * @type {String}
     */
    urlRoot: 'items',
    /**
     * @method ban
     */
    ban: function() {
        this.getVocab().banPart(this.get('part'));
    },
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
        var part = this.get('part');
        if (['rune', 'tone'].indexOf(part) > -1) {
            var containedVocabs =  this.getContainedVocabs();
            for (var i = 0, length = containedVocabs.length; i < length; i++) {
                var vocabId = containedVocabs[i].id;
                var splitId = vocabId.split('-');
                var fallbackId = [app.user.id, splitId[0], splitId[1], 0, part].join('-');
                var intendedId = [app.user.id, vocabId, part].join('-');
                if (this.collection.get(intendedId)) {
                    containedItems.push(this.collection.get(intendedId));
                } else {
                    containedItems.push(this.collection.get(fallbackId));
                }
            }
        }
        return  containedItems;
    },
    /**
     * @method getContainedVocabs
     * @returns {Array}
     */
    getContainedVocabs: function() {
        var vocab = this.getVocab();
        return vocab ? vocab.getContained() : [];
    },
    /**
     * @method getPromptItems
     * @returns {PromptItems}
     */
    getPromptItems: function() {
        var promptItems = new PromptItems();
        var containedItems = this.getContainedItems();
        var containedVocabs = this.getContainedVocabs();
        var now = Date.now();
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
            var childItem = items[i];
            var childVocab = vocabs[i];
            var promptItem = new PromptItem();
            promptItem.character = characters[i];
            promptItem.item = childItem;
            promptItem.vocab = childVocab;
            if (childVocab.isChinese()) {
                promptItem.set('filler', false);
                promptItem.set('kana', false);
            }
            if (childVocab.isJapanese()) {
                promptItem.set('kana', vocabs[i].isKana());
                if (['～', 'ー'].indexOf(childVocab.get('writing')) > -1) {
                    promptItem.set('filler', true);
                } else {
                    promptItem.set('filler', false);
                }
            }
            promptItems.add(promptItem);
        }
        promptItems.created = now;
        promptItems.group = now + '_' + this.id;
        promptItems.item = this;
        promptItems.part = part;
        promptItems.vocab = vocab;
        return promptItems;
    },
    /**
     * @method getReadiness
     * @returns {Number}
     */
    getReadiness: function() {
        if (this.get('vocabIds').length) {
            var now = this.collection.sorted || moment().unix();
            var itemLast = this.get('last');
            var itemNext = this.get('next');
            var actualAgo = now - itemLast;
            var scheduledAgo = itemNext - itemLast;
            return itemLast ? actualAgo / scheduledAgo : 9999;
        }
        return Number.NEGATIVE_INFINITY;
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
     * @returns {Vocab}
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
            if (vocab) {
                var vocabStyle = vocab.get('style');
                if (vocab.isChinese()) {
                    if (reviewSimplified && vocabStyle === 'simp') {
                        vocabs.push(vocab);
                    } else if (reviewTraditional && vocabStyle === 'trad') {
                        vocabs.push(vocab);
                    } else if (vocabStyle === 'both') {
                        vocabs.push(vocab);
                    } else if (vocabStyle === 'none') {
                        vocabs.push(vocab);
                    }
                } else {
                    vocabs.push(vocab);
                }
            }
        }
        return vocabs;
    },
    /**
     * @method isBanned
     * @returns {Boolean}
     */
    isBanned: function() {
        return _.includes(this.getVocab().get('bannedParts'), this.get('part'));
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
     * @method isKosher
     * @returns {Boolean}
     */
    isKosher: function() {
        var vocab = this.getVocab();
        if (!vocab) {
            return false;
        }
        if (this.isPartRune()) {
            if (!vocab.getStrokes().length) {
                return false;
            }
        }
        return true;
    },
    /**
     * @method isLeech
     * @returns {Boolean}
     */
    isLeech: function() {
        return this.consecutiveWrong >= 2;
    },
    /**
     * @method isNew
     * @returns {Boolean}
     */
    isNew: function() {
        return !this.get('reviews');
    },
    /**
     * @method isPartDefn
     * @returns {Boolean}
     */
    isPartDefn: function() {
        return this.get('part') === 'defn';
    },
    /**
     * @method isPartRdng
     * @returns {Boolean}
     */
    isPartRdng: function() {
        return this.get('part') === 'rdng';
    },
    /**
     * @method isPartRune
     * @returns {Boolean}
     */
    isPartRune: function() {
        return this.get('part') === 'rune';
    },
    /**
     * @method isPartTone
     * @returns {Boolean}
     */
    isPartTone: function() {
        return this.get('part') === 'tone';
    },
    /**
     * @method unban
     */
    unban: function() {
        this.getVocab().unbanPart(this.get('part'));
    }
});
