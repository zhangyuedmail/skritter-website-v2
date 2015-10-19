var GelatoCollection = require('gelato/collection');
var PromptReview = require('models/prompt-review');
var Review = require('models/review');

/**
 * @class PromptReviews
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
     * @type {PromptReview}
     */
    model: PromptReview,
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
     * @returns {PromptReview}
     */
    current: function() {
        return this.at(this.position);
    },
    /**
     * @method getBaseItemReview
     * @returns {Object}
     */
    getBaseItemReview: function() {
        return {
            bearTime: true,
            id: this.at(0).id,
            itemId: this.item ? this.item.id : this.vocab.id,
            reviewTime: this.getBaseReviewingTime(),
            score: this.getBaseScore(),
            submitTime: this.getBaseSubmitTime(),
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
     * @method getChildItemReviews
     * @returns {Array}
     */
    getChildItemReviews: function() {
        return this.filter(function(review) {
            return !review.get('kana');
        }).map(function(model) {
            return model.getItemReview();
        });
    },
    /**
     * @method getItemReviews
     * @returns {Object}
     */
    getItemReviews: function() {
        var reviews = [this.getBaseItemReview()];
        if (this.length > 1) {
            reviews = reviews.concat(this.getChildItemReviews());
        }
        return {id: this.group, data: reviews};
    },
    /**
     * @method getLimit
     * @returns {Number}
     */
    getLimit: function() {
        return this.part === 'tone' ? 15000 : 30000;
    },
    /**
     * @method isComplete
     * @returns {Boolean}
     */
    isComplete: function() {
        return !_.includes(this.pluck('complete'), false);
    },
    /**
     * @method isFirst
     * @returns {Boolean}
     */
    isFirst: function() {
        return this.position === 0;
    },
    /**
     * @method isLast
     * @returns {Boolean}
     */
    isLast: function() {
        return this.position >= this.length;
    },
    /**
     * @method isTeachable
     * @returns {Boolean}
     */
    isTeachable: function() {
        if (app.user.get('teachingMode')) {
            return this.item.isNew() || this.item.consecutiveWrong >= 2;
        }
        return false;
    },
    /**
     * @method next
     * @returns {PromptReview}
     */
    next: function() {
        if (!this.isLast()) {
            this.position++;
        }
        return this.current();
    },
    /**
     * @method previous
     * @returns {PromptReview}
     */
    previous: function() {
        if (!this.isFirst()) {
            this.position--;
        }
        return this.current();
    }
});