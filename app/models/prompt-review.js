var GelatoModel = require('gelato/model');

/**
 * @class PromptReview
 * @extends {GelatoModel}
 */
module.exports = GelatoModel.extend({
    /**
     * @property character
     * @type {PromptCharacter}
     */
    character: null,
    /**
     * @property item
     * @type {Item}
     */
    item: null,
    /**
     * @property vocab
     * @type {Vocab}
     */
    vocab: null,
    /**
     * @method defaults
     * @returns {Object}
     */
    defaults: function() {
        return {
            attempts: 0,
            complete: false,
            reviewingStart: 0,
            reviewingStop: 0,
            score: 3,
            submitTime: 0,
            thinkingStop: 0,
            teach: false
        };
    },
    /**
     * @method getGradingColor
     * @returns {String}
     */
    getGradingColor: function() {
        return app.user.get('gradingColors')[this.get('score')];
    },
    /**
     * @method getItemReview
     * @returns {Object}
     */
    getItemReview: function() {
        return {
            bearTime: false,
            itemId: this.item ? this.item.id : this.vocab.id,
            reviewTime: this.getReviewingTime(),
            score: this.get('score'),
            submitTime: this.get('submitTime'),
            thinkingTime: this.getThinkingTime(),
            wordGroup: this.collection.group
        };
    },
    /**
     * @method getPosition
     * @returns {Number}
     */
    getPosition: function() {
        return this.collection.indexOf(this);
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
     * @method getTones
     * @returns {Array}
     */
    getTones: function() {
        return this.collection.vocab.getTones()[this.getPosition()];
    },
    /**
     * @method isComplete
     * @returns {Boolean}
     */
    isComplete: function() {
        return this.get('complete');
    },
    /**
     * @method start
     * @returns {PromptReview}
     */
    start: function() {
        if (this.get('reviewingStart') === 0) {
            this.set({
                reviewingStart: new Date().getTime(),
                submitTime: moment().unix()
            });
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