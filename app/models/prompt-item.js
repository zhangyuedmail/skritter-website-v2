var GelatoModel = require('gelato/model');

/**
 * @class PromptItem
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
            complete: false,
            failedConsecutive: 0,
            failedTotal: 0,
            reviewingStart: 0,
            reviewingStop: 0,
            score: 3,
            showContained: false,
            showDefinition: false,
            showMnemonic: false,
            showReading: false,
            showTeaching: false,
            submitTime: 0,
            thinkingStop: 0
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
     * @method getPosition
     * @returns {Number}
     */
    getPosition: function() {
        return this.collection.indexOf(this);
    },
    /**
     * @method getReviewData
     * @returns {Object}
     */
    getReviewData: function() {
        return {
            bearTime: false,
            id: this.id,
            itemId: this.item ? this.item.id : this.vocab.id,
            reviewTime: this.getReviewingTime(),
            score: this.get('score'),
            submitTime: this.get('submitTime'),
            thinkingTime: this.getThinkingTime(),
            wordGroup: this.collection.group
        };
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
     * @method isChinese
     * @returns {Boolean}
     */
    isChinese: function() {
        return this.vocab.isChinese();
    },
    /**
     * @method isComplete
     * @returns {Boolean}
     */
    isComplete: function() {
        return this.get('complete');
    },
    /**
     * @method isDefinitionHidden
     * @returns {Boolean}
     */
    isDefinitionHidden: function() {
        if (this.get('showDefinition')) {
            return false;
        }
        if (this.collection.part === 'rdng' && !this.isComplete()) {
            return true;
        }
        if (this.isJapanese()) {
            return app.user.get('hideDefinition') && !this.collection.isComplete();
        } else {
            return app.user.get('hideDefinition') && !this.isComplete();
        }
    },
    /**
     * @method isJapanese
     * @returns {Boolean}
     */
    isJapanese: function() {
        return this.vocab.isJapanese();
    },
    /**
     * @method isReadingHidden
     * @returns {Boolean}
     */
    isReadingHidden: function() {
        if (this.get('showReading')) {
            return false;
        }
        if (this.collection.part === 'defn' && !this.isComplete()) {
            return true;
        }
        if (this.isJapanese()) {
            return app.user.get('hideReading') && !this.collection.isComplete();
        } else {
            return app.user.get('hideReading') && !this.isComplete();
        }
    },
    /**
     * @method start
     * @returns {PromptItem}
     */
    start: function() {
        if (this.get('reviewingStart') === 0) {
            var now = Date.now();
            this.set({
                reviewingStart: now,
                submitTime: now / 1000
            });
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
            this.set('reviewingStop', timestamp || Date.now());
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
            this.set('thinkingStop', timestamp || Date.now());
        }
        return this;
    }
});