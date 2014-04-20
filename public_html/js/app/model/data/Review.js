/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class DataReview
     */
    var Review = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.characters = null;
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            originalItems: [],
            position: 1,
            reviews: []
        },
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('reviews', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method getBaseItem
         * @returns {Backbone.Model}
         */
        getBaseItem: function() {
            return skritter.user.data.items.get(this.get('reviews')[0].itemId);
        },
        /**
         * @method getBaseVocab
         * @returns {Backbone.Model}
         */
        getBaseVocab: function() {
            return this.getBaseItem().getVocab();
        },
        /**
         * @method getCharacterAt
         * @param {Number} position
         * @returns {Backbone.Collection}
         */
        getCharacterAt: function(position) {
            if (this.characters)
                return this.hasContained() ? this.characters[position] : this.characters[0];
            return this.characters;
        },
        /**
         * @method getFinalScore
         * @returns {Number}
         */
        getFinalScore: function() {
            var grade = this.get('reviews')[0].score;
            if (this.hasContained()) {
                var max = this.get('reviews').length - 1;
                var totalScore = 0;
                var totalWrong = 0;
                for (var i = 1, length = this.get('reviews').length; i < length; i++) {
                    var review = this.get('reviews')[i];
                    totalScore += review.score;
                    if (review.score === 1)
                        totalWrong++;
                }
                if (max === 2 && totalWrong === 1) {
                    grade = 1;
                } else if (totalWrong > 1) {
                    grade = 1;
                } else {
                    grade = Math.floor(totalScore / max);
                }
            }
            return grade;
        },
        /**
         * @method getItemAt
         * @param {Number} position
         * @returns {Backbone.Model}
         */
        getItemAt: function(position) {
            return skritter.user.data.items.get(this.getReviewAt(position).itemId);
        },
        /**
         * @method getOriginalItemAt
         * @param {Number} position
         * @returns {Object}
         */
        getOriginalItemAt: function(position) {
            if (this.get('originalItems').length > 1 && position !== 0)
                return this.get('originalItems')[position];
            return this.get('originalItems')[0];
        },
        /**
         * @method getTotalReviewTime
         * @returns {Number}
         */
        getTotalReviewTime: function() {
            var reviewTime = 0;
            if (this.hasContained()) {
                for (var i = 1, length = this.get('reviews').length; i < length; i++)
                    reviewTime += this.get('reviews')[i].reviewTime;
            } else {
                reviewTime = this.get('reviews')[0].reviewTime;
            }
            return reviewTime;
        },
        /**
         * @method getReviewAt
         * @param {Number} position
         * @returns {Object}
         */
        getReviewAt: function(position) {
            if (this.hasContained() && position !== 0)
                return this.get('reviews')[position];
            return this.get('reviews')[0];
        },
        /**
         * @method getTotalThinkingTime
         * @returns {Number}
         */
        getTotalThinkingTime: function() {
            var thinkingTime = 0;
            if (this.hasContained()) {
                for (var i = 1, length = this.get('reviews').length; i < length; i++)
                    thinkingTime += this.get('reviews')[i].thinkingTime;
            } else {
                thinkingTime = this.get('reviews')[0].thinkingTime;
            }
            return thinkingTime;
        },
        /**
         * @method getVocabAt
         * @param {Number} position
         * @returns {Backbone.Model}
         */
        getVocabAt: function(position) {
            return skritter.user.data.items.get(this.getReviewAt(position).itemId).getVocab();
        },
        /**
         * @method hasContained
         * @returns {Boolean}
         */
        hasContained: function() {
            if (this.get('reviews').length > 1)
                return true;
            return false;
        },
        /**
         * @method isFirst
         * @returns {Boolean}
         */
        isFirst: function() {
            return this.get('position') === 1 ? true : false;
        },
        /**
         * @method isLast
         * @returns {Boolean}
         */
        isLast: function() {
            var position = this.hasContained() ? this.get('reviews').length - 1 : 1;
            return this.get('position') === position ? true : false;
        },
        /**
         * @method save
         * @param {Function} callback
         */
        save: function(callback) {
            var reviews = this.get('reviews');
            if (skritter.user.data.reviews.get(this)) {
                //updates the base review based on contained reviews
                if (this.hasContained()) {
                    reviews[0].reviewTime = this.getTotalReviewTime();
                    reviews[0].thinkingTime = this.getTotalThinkingTime();
                }
                //updates all of the new review intervals and items
                for (var i = 0, length = reviews.length; i < length; i++) {
                    var item = this.getItemAt(i);
                    var review = reviews[i];
                    if (parseInt(i, 10) === 0 && reviews.length > 1)
                        review.score = this.getFinalScore();
                    review.newInterval = skritter.user.scheduler.calculateInterval(item, review.score);
                    item.set({
                        changed: review.submitTime,
                        last: review.submitTime,
                        interval: review.newInterval,
                        next: review.submitTime + review.newInterval,
                        previousInterval: review.currentInterval,
                        previousSuccess: review.score > 1 ? true : false
                        //TODO: remove or add successes based on previous score
                        //successes: review.score > 1 ? item.get('successes') + 1 : item.get('successes')
                    }, {silent: true, sort: false});
                }
            } else {
                //updates the base review based on contained reviews
                if (this.hasContained()) {
                    reviews[0].reviewTime = this.getTotalReviewTime();
                    reviews[0].thinkingTime = this.getTotalThinkingTime();
                }
                //updates all of the new review intervals and items
                for (var i = 0, length = reviews.length; i < length; i++) {
                    var item = this.getItemAt(i);
                    var review = reviews[i];
                    if (parseInt(i, 10) === 0 && reviews.length > 1)
                        review.score = this.getFinalScore();
                    review.newInterval = skritter.fn.scheduler.interval(item, review.score);
                    item.set({
                        changed: review.submitTime,
                        last: review.submitTime,
                        interval: review.newInterval,
                        next: review.submitTime + review.newInterval,
                        previousInterval: review.currentInterval,
                        previousSuccess: review.score > 1 ? true : false,
                        reviews: item.get('reviews') + 1,
                        successes: review.score > 1 ? item.get('successes') + 1 : item.get('successes'),
                        timeStudied: item.get('timeStudied') + review.reviewTime
                    }, {silent: true, sort: false});
                }
                //save the reviews to the official collection
                skritter.user.data.reviews.add(this, {merge: true, silent: true, sort: false});
            }
            async.series([
                _.bind(function(callback) {
                    this.cache(callback);
                }, this),
                function(callback) {
                    skritter.user.data.items.cache(callback);
                }
            ], function() {
                skritter.user.data.reviews.sort();
                callback();
            });
        },
        /**
         * @method setReviewAt
         * @param {Number} position
         * @param {String|Object} key
         * @param {Array|Number|Object|String} value
         * @returns {Object}
         */
        setReviewAt: function(position, key, value) {
            var review = this.hasContained() ? this.get('reviews')[position] : this.get('reviews')[0];
            var data = {};
            if (typeof key === 'object') {
                data = key;
            } else {
                data[key] = value;
            }
            if (data)
                for (var obj in data)
                    review[obj] = data[obj];
            return review;
        },
        /**
         * @method uncache
         * @param {Function} callback
         */
        uncache: function(callback) {
            skritter.storage.remove('reviews', this.id, function() {
                if (typeof callback === 'function')
                    callback();
            });
        }
    });

    return Review;
});