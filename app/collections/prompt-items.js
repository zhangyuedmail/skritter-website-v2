var GelatoCollection = require('gelato/collection');
var PromptItem = require('models/prompt-item');
var Review = require('models/review');

/**
 * @class PromptItems
 * @extends {GelatoCollection}
 */
module.exports = GelatoCollection.extend({
    /**
     * @property group
     * @type {String}
     */
    group: null,
    /**
     * @property item
     * @type {Item}
     */
    item: null,
    /**
     * @property model
     * @type {PromptItem}
     */
    model: PromptItem,
    /**
     * @property originals
     * @type {Array}
     */
    originals: [],
    /**
     * @property part
     * @type {String}
     */
    part: null,
    /**
     * @property position
     * @type {Number}
     */
    position: 0,
    /**
     * @property vocab
     * @type {Vocab}
     */
    vocab: null,
    /**
     * @method current
     * @returns {PromptItem}
     */
    current: function() {
        return this.at(this.position);
    },
    /**
     * @method getBaseReviewData
     * @returns {Object}
     */
    getBaseReviewData: function() {
        return {
            bearTime: true,
            id: this.at(0).id,
            itemId: this.item ? this.item.id : this.vocab.id,
            reviewTime: this.getBaseReviewingTime(),
            score: this.getBaseScore(),
            submitTime: this.getBaseSubmitTime(),
            submitTimeSeconds: this.getBaseSubmitTimeSeconds(),
            thinkingTime: this.getBaseThinkingTime(),
            wordGroup: this.group
        };
    },
    /**
     * @method getBaseSubmitTime
     * @returns {Number}
     */
    getBaseSubmitTime: function() {
        return this.at(0).get('submitTime');
    },
    /**
     * @method getBaseSubmitTimeSeconds
     * @returns {Number}
     */
    getBaseSubmitTimeSeconds: function() {
        return this.at(0).get('submitTimeSeconds');
    },
    /**
     * @method getBaseReviewingTime
     * @returns {Number}
     */
    getBaseReviewingTime: function() {
        var reviewingTime = 0;
        for (var i = 0, length = this.length; i < length; i++) {
            reviewingTime += this.at(i).getReviewingTime();
        }
        return reviewingTime;
    },
    /**
     * @method getBaseScore
     * @returns {Number}
     */
    getBaseScore: function() {
        var score = null;
        if (this.length > 1) {
            var totalCount = this.length;
            var totalScore = 0;
            var totalWrong = 0;
            for (var i = 0, length = this.length; i < length; i++) {
                var reviewScore = this.at(i).get('score');
                totalScore += reviewScore;
                if (reviewScore === 1) {
                    totalWrong++;
                }
            }
            if (totalCount === 2 && totalWrong === 1) {
                score = 1;
            } else if (totalWrong > 1) {
                score = 1;
            } else {
                score = Math.floor(totalScore / totalCount);
            }
        }
        return score || this.at(0).get('score');
    },
    /**
     * @method getBaseThinkingTime
     * @returns {Number}
     */
    getBaseThinkingTime: function() {
        var thinkingTime = 0;
        for (var i = 0, length = this.length; i < length; i++) {
            thinkingTime += this.at(i).getThinkingTime();
        }
        return thinkingTime;
    },
    /**
     * @method getChildReviewData
     * @returns {Array}
     */
    getChildReviewData: function() {
        return this.filter(function(review) {
            return !review.get('kana');
        }).map(function(model) {
            return model.getReviewData();
        });
    },
    /**
     * @method getReview
     * @returns {Object}
     */
    getReview: function() {
        var reviews = [this.getBaseReviewData()];
        if (this.length > 1) {
            reviews = reviews.concat(this.getChildReviewData());
        }
        return {
            created: this.created,
            data: reviews,
            group: this.group,
            promptItems: this
        };
    },
    /**
     * @method getLimit
     * @returns {Number}
     */
    getLimit: function() {
        return this.part === 'tone' ? 15000 : 30000;
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
        return _.includes(this.pluck('complete'), false) === false;
    },
    /**
     * @method isFirst
     * @returns {Boolean}
     */
    isFirst: function() {
        return this.position === 0;
    },
    /**
     * @method isJapanese
     * @returns {Boolean}
     */
    isJapanese: function() {
        return this.vocab.isJapanese();
    },
    /**
     * @method isNew
     * @returns {Boolean}
     */
    isNew: function() {
        return this.item ? this.item.isNew() : false;
    },
    /**
     * @method isLast
     * @returns {Boolean}
     */
    isLast: function() {
        return this.position >= this.length - 1;
    },
    /**
     * @method isTeachable
     * @returns {Boolean}
     */
    isTeachable: function() {
        if (this.item && app.user.get('teachingMode')) {
            return this.item.isNew() || this.item.isLeech();
        }
        return false;
    },
    /**
     * @method next
     * @returns {PromptItem}
     */
    next: function() {
        if (!this.isLast()) {
            this.position++;
        }
        return this.current();
    },
    /**
     * @method previous
     * @returns {PromptItem}
     */
    previous: function() {
        if (!this.isFirst()) {
            this.position--;
        }
        return this.current();
    }
});