/**
 * @module Application
 */
define([
    'framework/BaseModel',
    'models/data/DataReview'
], function(BaseModel, DataReview) {
    /**
     * @class DataItem
     * @extends BaseModel
     */
    var DataItem = BaseModel.extend({
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
            created: moment().unix(),
            changed: moment().unix(),
            interval: 0,
            lang: undefined,
            last: 0,
            next: 0,
            part: undefined,
            previousInterval: 0,
            previousSuccess: false,
            reviews: 0,
            sectionIds: [],
            style: undefined,
            successes: 0,
            timeStudied: 0,
            vocabIds: [],
            vocabListIds: []
        },
        /**
         * @method createReview
         * @returns {DataReview}
         */
        createReview: function() {
            var review = new DataReview();
            var items = [this].concat(this.getContainedItems());
            var now = moment().unix();
            var part = this.get('part');
            var reviews = [];
            var wordGroup = now + app.fn.getGuid() + '_' + this.id;
            for (var i = 0, length = items.length; i < length; i++) {
                var item = items[i];
                reviews.push({
                    itemId: item.id,
                    score: 3,
                    bearTime: i === 0 ? true : false,
                    submitTime: now,
                    reviewTime: 0,
                    thinkingTime: 0,
                    currentInterval: item.get('interval'),
                    actualInterval: item.get('last'),
                    newInterval: undefined,
                    wordGroup: wordGroup,
                    previousInterval: item.get('previousInterval'),
                    previousSuccess: item.get('previousSuccess')
                });
            }
            if (['rune', 'tone'].indexOf(part) !== -1) {
                review.characters = this.getVocab().getCanvasCharacters();
            }
            return review.set({
                id: wordGroup,
                itemId: items[0].id,
                part: part,
                reviews: reviews
            });
        },
        /**
         * @method getContainedItems
         * @returns {Array}
         */
        getContainedItems: function() {
            var items = [];
            var part = this.get('part');
            if (['rune', 'tone'].indexOf(part) !== -1) {
                var containedIds = this.getVocab().getContainedItemIds(part);
                for (var i = 0, length = containedIds.length; i < length; i++) {
                    items.push(app.user.data.items.get(containedIds[i]));
                }
            }
            return items;
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
            var activeStyles = app.user.settings.getActiveStyles();
            for (var i = 0, length = this.get('vocabIds').length; i < length; i++) {
                var vocab = app.user.data.vocabs.get(this.get('vocabIds')[i]);
                if (vocab) {
                    if (app.user.isChinese() && activeStyles.indexOf(vocab.attributes.style) !== -1) {
                        vocabs.push(vocab);
                    } else if (app.user.isJapanese()) {
                        vocabs.push(vocab);
                    }
                }
            }
            return vocabs;
        }
    });

    return DataItem;
});
