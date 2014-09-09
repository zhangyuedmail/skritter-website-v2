/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
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
                if (vocab && activeStyles.indexOf(vocab.attributes.style) !== -1) {
                    vocabs.push(vocab);
                }
            }
            return vocabs;
        }
    });

    return DataItem;
});
