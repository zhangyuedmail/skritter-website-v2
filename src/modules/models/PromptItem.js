/**
 * @module Application
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class PromptItem
     * @extends GelatoModel
     */
    var PromptItem = GelatoModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @method defaults
         * @returns {Object}
         */
        defaults: function() {
            return {
                character: null,
                complete: false,
                reviewingStart: 0,
                reviewingStop: 0,
                score: 3,
                submitTime: Moment().unix(),
                thinkingStop: 0,
                vocabId: null
            };
        },
        /**
         * @method getGradingColor
         * @returns {String}
         */
        getGradingColor: function() {
            return app.user.settings.get('gradingColors')[this.get('score')];
        },
        /**
         * @method getReviewingTime
         * @returns {Number}
         */
        getReviewingTime: function() {
            return (this.get('reviewingStop') - this.get('reviewingStart')) / 1000;
        },
        /**
         * @method getThinkingTime
         * @returns {Number}
         */
        getThinkingTime: function() {
            return (this.get('thinkingStop') - this.get('reviewingStart')) / 1000;
        },
        /**
         * @method getVocab
         * @returns {DataVocab}
         */
        getVocab: function() {
            return app.user.data.vocabs.get(this.get('vocabId'));
        },
        /**
         * @method isComplete
         * @returns {Boolean}
         */
        isComplete: function() {
            if (['rune', 'tone'].indexOf(this.collection.part) > -1) {
                return this.get('character').isComplete();
            }
            return this.get('complete');
        },
        /**
         * @method start
         * @returns {PromptItem}
         */
        start: function() {
            if (this.get('reviewingStart') === 0) {
                this.set('reviewingStart', new Date().getTime());
            }
            return this;
        },
        /**
         * @method stop
         * @returns {PromptItem}
         */
        stop: function() {
            var timestamp = new Date().getTime();
            this.stopReviewing(timestamp);
            this.stopThinking(timestamp);
            return this;
        },
        /**
         * @method stopReviewing
         * @param {Number} [timestamp]
         * @returns {PromptItem}
         */
        stopReviewing: function(timestamp) {
            if (this.get('reviewingStop') === 0) {
                this.set('reviewingStop', timestamp || new Date().getTime());
            }
            return this;
        },
        /**
         * @method stopThinking
         * @param {Number} [timestamp]
         * @returns {PromptItem}
         */
        stopThinking: function(timestamp) {
            if (this.get('thinkingStop') === 0) {
                this.set('thinkingStop', timestamp || new Date().getTime());
            }
            return this;
        }
    });

    return PromptItem;

});