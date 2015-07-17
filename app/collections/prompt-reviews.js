var GelatoCollection = require('gelato/collection');
var PromptReview = require('models/prompt-review');

/**
 * @class PromptReviews
 * @extends {GelatoCollection}
 */
module.exports = GelatoCollection.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.item = null;
        this.part = null;
        this.position = 0;
    },
    /**
     * @property model
     * @type {PromptReview}
     */
    model: PromptReview,
    /**
     * @method active
     * @returns {PromptReview}
     */
    active: function() {
        return this.at(this.position);
    },
    /**
     * @method generateBaseReview
     * @returns {Object}
     */
    generateBaseReview: function() {
        return {
            itemId: this.item.id,
            score: this.getScore() || 3,
            bearTime: true,
            submitTime: this.getSubmitTime(),
            reviewTime: this.getReviewingTime() || 5,
            thinkingTime: this.getThinkingTime() || 1,
            currentInterval: this.item.interval || 0,
            actualInterval: this.getActualInterval() || 0,
            newInterval: this.getNewInterval(),
            wordGroup: this.group,
            previousInterval: this.item.previousInterval || 0,
            previousSuccess: this.item.previousSuccess || false
        };
    },
    /**
     * @method generateChildReviews
     * @returns {Array}
     */
    generateChildReviews: function() {
        var reviews = [];
        for (var i = 0, length = this.length; i < length; i++) {
            var review = this.at(i);
            reviews.push({
                itemId: review.item.id,
                score: review.get('score') || 3,
                bearTime: false,
                submitTime: review.get('submitTime'),
                reviewTime: review.getReviewingTime() || 5,
                thinkingTime: review.getThinkingTime() || 1,
                currentInterval: review.item.interval || 0,
                actualInterval: review.getActualInterval() || 0,
                newInterval: review.getNewInterval(),
                wordGroup: this.group,
                previousInterval: review.item.previousInterval || 0,
                previousSuccess: review.item.previousSuccess || false
            });
        }
        return reviews;
    },
    /**
     * @method getActualInterval
     * @returns {number}
     */
    getActualInterval: function() {
        return this.getSubmitTime() - this.item.last;
    },
    /**
     * @method getNewInterval
     * @returns {Number}
     */
    getNewInterval: function() {
        return app.fn.interval.quantify(this.item, this.getScore());
    },
    /**
     * @method getReviewingTime
     * @returns {Number}
     */
    getReviewingTime: function() {
        var reviewingTime = 0;
        for (var i = 0, length = this.length; i < length; i++) {
            reviewingTime += this.at(i).getReviewingTime();
        }
        return reviewingTime;
    },
    /**
     * @method getScore
     * @returns {Number}
     */
    getScore: function() {
        var score = this.at(0).get('score');
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
        return score;
    },
    /**
     * @method getSubmitTime
     * @returns {Number}
     */
    getSubmitTime: function() {
        return this.at(0).get('submitTime');
    },
    /**
     * @method getThinkingTime
     * @returns {Number}
     */
    getThinkingTime: function() {
        var thinkingTime = 0;
        for (var i = 0, length = this.length; i < length; i++) {
            thinkingTime += this.at(i).getThinkingTime();
        }
        return thinkingTime;
    },
    /**
     * @method getToneNumbers
     * @returns {Array}
     */
    getToneNumbers: function() {
        return this.vocab.getToneNumbers(this.position);
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
     * @method isPartDefn
     * @returns {Boolean}
     */
    isPartDefn: function() {
        return this.item.part === 'defn';
    },
    /**
     * @method isPartRdng
     * @returns {Boolean}
     */
    isPartRdng: function() {
        return this.item.part === 'rdng';
    },
    /**
     * @method isPartRune
     * @returns {Boolean}
     */
    isPartRune: function() {
        return this.item.part === 'rune';
    },
    /**
     * @method isPartTone
     * @returns {Boolean}
     */
    isPartTone: function() {
        return this.item.part === 'tone';
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
    },
    /**
     * @method updateItems
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    updateItems: function(callbackSuccess, callbackError) {
        var updatedItems = [];
        var reviews = [this.generateBaseReview()];
        if (this.length > 1) {
            reviews = reviews.concat(this.generateChildReviews());
        }
        async.eachSeries(reviews, function(review, callback) {
            var item = app.user.data.items.get(review.itemId);
            item.set({
                changed: review.submitTime,
                last: review.submitTime,
                interval: review.newInterval,
                next: review.submitTime + review.newInterval,
                previousInterval: review.currentInterval,
                previousSuccess: review.score > 1,
                reviews: item.get('reviews') + 1,
                successes: review.score > 1 ? item.get('successes') + 1 : item.get('successes'),
                timeStudied: item.get('timeStudied') + review.reviewTime
            });
            updatedItems.push(item);
            callback();
        }, function(error) {
            if (error) {
                callbackError(error);
            } else {
                app.user.history.add({reviews: reviews, timestamp: Date.now()});
                callbackSuccess();
            }
        });
    }
});