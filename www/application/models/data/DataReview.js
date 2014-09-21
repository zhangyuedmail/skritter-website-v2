/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class DataReview
     * @extends BaseModel
     */
    var DataReview = BaseModel.extend({
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
            position: 1,
            reviews: []
        },
        /**
         * @method getAt
         * @param {String} [key]
         * @returns {Number|String}
         */
        getAt: function(key) {
            if (key) {
                return this.get('reviews')[this.hasContained() ? this.getPosition() : 0][key];
            }
            return this.get('reviews')[this.hasContained() ? this.getPosition() : 0];
        },
        /**
         * @method getBaseItem
         * @returns {DataItem}
         */
        getBaseItem: function() {
            return app.user.data.items.get(this.get('reviews')[0].itemId);
        },
        /**
         * @method getBaseVocab
         * @returns {DataVocab}
         */
        getBaseVocab: function() {
            return this.getBaseItem().getVocab();
        },
        /**
         * @method getItem
         * @returns {DataItem}
         */
        getItem: function() {
            return app.user.data.items.get(this.getAt('itemId'));
        },
        /**
         * @method getVocab
         * @returns {DataVocab}
         */
        getVocab: function() {
            if (this.hasContained()) {
                var vocabId = this.getBaseVocab().get('containedVocabIds')[this.getPosition() - 1];
                return app.user.data.vocabs.get(vocabId);
            }
            return this.getItem().getVocab();
        },
        /**
         * @method getMaxPosition
         * @returns {Number}
         */
        getMaxPosition: function() {
            return this.hasContained() ? this.get('reviews').length - 1 : 1;
        },
        /**
         * @method getPosition
         * @returns {Number}
         */
        getPosition: function() {
            return this.hasContained() ? this.get('position') : 1;
        },
        /**
         * @method hasContained
         * @returns {Boolean}
         */
        hasContained: function() {
            return this.get('reviews').length > 1 ? true : false;
        },
        /**
         * @method isAnswered
         * @returns {Boolean}
         */
        isAnswered: function() {
            return this.getAt('newInterval') ? true : false;
        },
        /**
         * @method isFirst
         * @returns {Boolean}
         */
        isFirst: function() {
            return this.getPosition() === 1;
        },
        /**
         * @method isLast
         * @returns {Boolean}
         */
        isLast: function() {
            return this.getPosition() >= this.getMaxPosition();
        },
        /**
         * @method next
         * @returns {Boolean}
         */
        next: function() {
            if (this.isLast()) {
                return fale;
            }
            this.attributes.position++;
            return true;
        },
        /**
         * @method previous
         * @returns {Boolean}
         */
        previous: function() {
            if (this.isFirst()) {
                return false;
            }
            this.attributes.position--;
            return true;
        },
        /**
         * @method setAt
         * @param {Object|String} key
         * @param {Number|String} value
         * @returns {Object}
         */
        setAt: function(key, value) {
            var review = this.getAt();
            if (typeof key === 'object') {
                for (var property in key) {
                    review[property] = key[property];
                }
            } else {
                review[key] = value;
            }
            return review;
        }
    });

    return DataReview;
});
