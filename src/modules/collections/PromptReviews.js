/**
 * @module Application
 */
define([
    'core/modules/GelatoCollection',
    'modules/models/PromptReview'
], function(GelatoCollection, PromptReview) {

    /**
     * @class PromptReviews
     * @extends GelatoCollection
     */
    var PromptReviews = GelatoCollection.extend({
        /**
         * @method initialize
         * @param {Array|Object} [models]
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(models, options) {
            models = models || {};
            options = options || {};
            this.part = null;
            this.position = 0;
        },
        /**
         * @property model
         * @type {PromptReview}
         */
        model: PromptReview,
        /**
         * @method getCharacter
         * @returns {CanvasCharacter}
         */
        getCharacter: function() {
            return this.getItem().character;
        },
        /**
         * @method getToneNumbers
         * @returns {Array}
         */
        getToneNumbers: function() {
            return this.getVocab().getToneNumbers(this.position);
        },
        /**
         * @method getVocabId
         * @returns {String}
         */
        getVocabId: function() {
            return this.at(0).vocab.id;
        },
        /**
         * @method getItem
         * @returns {PromptReview}
         */
        getItem: function() {
            return this.at(this.position);
        },
        /**
         * @method getVocab
         * @returns {DataVocab}
         */
        getVocab: function() {
            return app.user.data.vocabs.get(this.getVocabId());
        },
        /**
         * @method isFirst
         * @returns {Boolean}
         */
        isFirst: function() {
            return this.position <= 0;
        },
        /**
         * @method isLast
         * @returns {Boolean}
         */
        isLast: function() {
            return this.position >= this.length - 1;
        },
        /**
         * @method next
         * @return {Boolean}
         */
        next: function() {
            if (this.isLast()) {
                return false;
            }
            this.position++;
            return true;
        },
        /**
         * @method previous
         * @return {Boolean}
         */
        previous: function() {
            if (this.isFirst()) {
                return false;
            }
            this.position--;
            return true;
        }
    });

    return PromptReviews;

});