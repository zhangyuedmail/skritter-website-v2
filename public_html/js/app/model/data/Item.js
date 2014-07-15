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
        },
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('items', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
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
            var part = this.get('part');
            var reviews = [];
            var wordGroup = now + '_' + skritter.fn.getGuid() + '_' + this.id;
            if (part === 'rune' || part === 'tone') {
                review.characters = this.getCanvasCharacters();
            }
            for (var i = 0, length = items.length; i < length; i++) {
                var item = items[i];
                reviews.push({
                    itemId: item.id,
                    finished: false,
                    started: false,
                    score: 3,
                    bearTime: i === 0 ? true : false,
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
            }
            review.set({
                id: wordGroup,
                itemId: items[0].id,
                part: part,
                reviews: reviews
            });
            return review;
        },
        /**
         * @method getCanvasCharacters
         * @returns {Array}
         */
        getCanvasCharacters: function() {
            var strokes = this.getStrokes();
            if (strokes) {
                var canvasCharacters = [];
                for (var i = 0, length = strokes.length; i < length; i++) {
                    canvasCharacters.push(strokes[i].getCanvasCharacter());
                }
                return canvasCharacters;
            }
            return null;
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
                for (var i = 0, length = containedIds.length; i < length; i++) {
                    items.push(skritter.user.data.items.get(containedIds[i]));
                }
            }
            return items;
        },
        /**
         * @method getStroke
         * @returns {Array}
         */
        getStrokes: function() {
            var part = this.get('part');
            if (part === 'rune') {
                return this.getVocab().getStrokes();
            } else if (part === 'tone') {
                var strokes = [];
                for (var i = 0, length = this.getVocab().getCharacterCount(); i < length; i++) {
                    strokes.push(skritter.user.data.strokes.get('tones'));
                }
                return strokes;
            }
            return null;
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
            return this.get('reviews') === 0 ? true : false;
        }
    });

    return Item;
});