/**
 * @module Skritter
 * @submodule Model
 * @param Review
 * @author Joshua McFarland
 */
define([
    'model/data/Review'
], function(Review) {
    /**
     * @class DataItem
     */
    var Item = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            if (this.get('held') && this.get('held') > skritter.fn.getUnixTime())
                this.unset('held');
        },
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
         * @method createReview
         * @returns {Backbone.Model}
         */
        createReview: function() {
            var review = new Review();
            var items = [this].concat(this.getContainedItems());
            var now = skritter.fn.getUnixTime();
            var originalItems = [];
            var part = this.get('part');
            var reviews = [];
            var wordGroup = now + '_' + skritter.fn.guid() + '_' + this.id;
            if (part === 'rune' || part === 'tone')
                review.characters = [];
            for (var i = 0, length = items.length; i < length; i++) {
                var item = items[i];
                originalItems.push(item.toJSON());
                reviews.push({
                    itemId: item.id,
                    score: 3,
                    bearTime: true,
                    submitTime: now,
                    reviewTime: 0,
                    thinkingTime: 0,
                    currentInterval: item.has('interval') ? item.get('interval') : 0,
                    actualInterval: item.has('last') ? now - item.get('last') : 0,
                    newInterval: undefined,
                    wordGroup: wordGroup,
                    previousInterval: item.has('previousInterval') ? item.get('previousInterval') : 0,
                    previousSuccess: item.has('previousSuccess') ? item.get('previousSuccess') : false
                });
                if (review.characters)
                    if (items.length === 1) {
                        review.characters.push(item.getStroke().getCanvasCharacter());
                    } else if (i > 0) {
                        review.characters.push(item.getStroke().getCanvasCharacter());
                    }
            }
            review.set({
                id: wordGroup,
                part: part,
                originalItems: originalItems,
                reviews: reviews
            }, {silent: true, sort: false});
            return review;
        },
        /**
         * @method getContainedItems
         * @returns {Array}
         */
        getContainedItems: function() {
            var items = [];
            var part = this.get('part');
            if (part === 'rune' || part === 'tone') {
                var containedIds = this.getVocab().getContainedItemIds(part);
                for (var i = 0, length = containedIds.length; i < length; i++)
                    items.push(skritter.user.data.items.get(containedIds[i]));
            }
            return items;
        },
        /**
         * @method getStroke
         * @returns {Backbone.Model}
         */
        getStroke: function() {
            if (this.get('part') === 'tone')
                return skritter.user.data.strokes.get('tones');
            return skritter.user.data.strokes.get(this.getVocab().get('writing'));
        },
        /**
         * @method getVocab
         * @returns {Backbone.Model}
         */
        getVocab: function() {
            return skritter.user.data.vocabs.get(this.getVocabId());
        },
        /**
         * @method getVocabId
         * @returns {String}
         */
        getVocabId: function() {
            var vocabIds = this.get('vocabIds');
            if (vocabIds.length === 0) {
                var splitId = this.id.split('-');
                return splitId[1] + '-' + splitId[2] + '-' + splitId[3];
            }
            return vocabIds[this.get('reviews') % vocabIds.length];
        },
        /**
         * @method isNew
         * @returns {Boolean}
         */
        isNew: function() {
            if (this.get('reviews') === 0)
                return true;
            return false;
        }
    });

    return Item;
});