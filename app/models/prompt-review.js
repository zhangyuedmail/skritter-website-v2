var GelatoModel = require('gelato/modules/model');

/**
 * @class PromptReview
 * @extends {GelatoModel}
 */
module.exports = GelatoModel.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.character = null;
        this.item = null;
        this.vocab = null;
    },
    /**
     * @property idAttribute
     * @type {String}
     */
    idAttribute: 'id',
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
            submitTime: 0,
            thinkingStop: 0
        };
    },
    /**
     * @method getActualInterval
     * @returns {number}
     */
    getActualInterval: function() {
        return this.get('submitTime') - this.item.last;
    },
    /**
     * @method getNewInterval
     * @returns {Number}
     */
    getNewInterval: function() {
        return app.fn.interval.quantify(this.item, this.get('score'));
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
        var reviewingTime = (this.get('reviewingStop') - this.get('reviewingStart')) / 1000;
        if (this.collection.part === 'tone') {
            return reviewingTime > 15 ? 15 : reviewingTime;
        }
        return reviewingTime > 30 ? 30 : reviewingTime;
    },
    /**
     * @method getThinkingTime
     * @returns {Number}
     */
    getThinkingTime: function() {
        var thinkingTime = (this.get('thinkingStop') - this.get('reviewingStart')) / 1000;
        if (this.collection.part === 'tone') {
            return thinkingTime > 10 ? 10 : thinkingTime;
        }
        return thinkingTime > 15 ? 15 : thinkingTime;
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
        return this.character ? this.character.isComplete() : this.get('complete');
    },
    /**
     * @method reset
     * @returns {PromptReview}
     */
    reset: function() {
        this.character.reset();
        return this;
    },
    /**
     * @method start
     * @returns {PromptReview}
     */
    start: function() {
        if (this.get('reviewingStart') === 0) {
            this.set({reviewingStart: new Date().getTime(), submitTime: moment().unix()});
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