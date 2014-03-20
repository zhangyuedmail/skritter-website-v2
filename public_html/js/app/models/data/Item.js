/**
 * @module Skritter
 * @submodule Models
 * @param Review
 * @author Joshua McFarland
 */
define([
    'models/data/Review'
], function(Review) {
    /**
     * @class DataItem
     */
    var Item = Backbone.Model.extend({
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
         * @method containedItems
         * @returns {Array}
         */
        containedItems: function() {
            var items = [];
            var part = this.get('part');
            if (part === 'rune' || part === 'tone') {
                var containedIds = this.vocab().containedItemIds(part);
                for (var i = 0, length = containedIds.length; i < length; i++)
                    items.push(skritter.user.data.items.get(containedIds[i]));
            }
            return items;
        },
        /**
         * @method createReview
         * @returns {Backbone.Model}
         */
        createReview: function() {
            var review = new Review();
            var items = [this].concat(this.containedItems());
            var now = skritter.fn.getUnixTime();
            var part = this.get('part');
            var wordGroup = now + '_' + this.id;
            review.set('id', wordGroup, {silent: true});
            if (part === 'rune' || part === 'tone')
                review.characters = [];
            for (var i = 0, length = items.length; i < length; i++) {
                var item = items[i];
                review.get('originalItems')[i] = item.toJSON();
                review.get('reviews')[i] = {
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
                    previousSuccess: item.has('previousSuccess') ? item.get('previousSuccess') : 0
                };
                if (review.characters)
                    if (items.length === 1) {
                        review.characters.push(item.stroke().canvasCharacter());
                    } else if (i > 0) {
                        review.characters.push(item.stroke().canvasCharacter());
                    }
            }
            return review;
        },
        /**
         * @method stroke
         * @returns {Backbone.Model}
         */
        stroke: function() {
            if (this.get('part') === 'tone')
                return skritter.user.data.strokes.get('tones');
            return skritter.user.data.strokes.get(this.vocab().get('writing'));
        },
        /**
         * @method vocab
         * @returns {Backbone.Model}
         */
        vocab: function() {
            return skritter.user.data.vocabs.get(this.vocabId());
        },
        /**
         * @method vocabId
         * @returns {String}
         */
        vocabId: function() {
            var vocabIds = this.get('vocabIds');
            if (vocabIds.length === 0) {
                var splitId = this.id.split('-');
                return splitId[1] + '-' + splitId[2] + '-' + splitId[3];
            }
            return vocabIds[this.get('reviews') % vocabIds.length];
        }
    });

    return Item;
});