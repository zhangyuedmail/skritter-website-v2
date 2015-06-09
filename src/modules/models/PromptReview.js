/**
 * @module Application
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class PromptReview
     * @extends GelatoModel
     */
    var PromptReview = GelatoModel.extend({
        /**
         * @method initialize
         * @param {Object} [attributes]
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(attributes, options) {
            attributes = attributes || {};
            options = options || {};
            this.character = null;
            this.item = null;
            this.vocab = null;
        },
        /**
         * @method defaults
         * @returns {Object}
         */
        defaults: function() {
            return {
                complete: false,
                reviewingStart: 0,
                reviewingStop: 0,
                score: 3,
                submitTime: Moment().unix(),
                thinkingStop: 0
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
            return this.vocab;
        },
        /**
         * @method isComplete
         * @returns {Boolean}
         */
        isComplete: function() {
            if (['rune', 'tone'].indexOf(this.collection.part) > -1) {
                return this.character.isComplete();
            }
            return this.get('complete');
        },
        /**
         * @method start
         * @returns {PromptReview}
         */
        start: function() {
            if (this.get('reviewingStart') === 0) {
                this.set({reviewingStart: new Date().getTime(), submitTime: Moment().unix()});
            }
            return this;
        },
        /**
         * @method stop
         * @returns {PromptReview}
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
         * @returns {PromptReview}
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
         * @returns {PromptReview}
         */
        stopThinking: function(timestamp) {
            if (this.get('thinkingStop') === 0) {
                this.set('thinkingStop', timestamp || new Date().getTime());
            }
            return this;
        }
    });

    return PromptReview;

});