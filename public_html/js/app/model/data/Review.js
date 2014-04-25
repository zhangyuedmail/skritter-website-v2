/**
 * @module Skritter
 * @submodule Model
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
            position = position ? position : this.get('position');
            if (this.characters)
                return this.characters[position - 1];
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
            position = position || position === 0 ? position : this.get('position');
            return skritter.user.data.items.get(this.getReviewAt(position).itemId);
        },
        /**
         * @method getOriginalItemAt
         * @param {Number} position
         * @returns {Object}
         */
        getOriginalItemAt: function(position) {
            position = position ? position : this.get('position');
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
            position = position || position === 0 ? position : this.get('position');
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
         * @method previous
         * @returns {Boolean}
         */
        previous: function() {
            if (this.isFirst())
                return false;
            this.set('position', this.get('position') - 1, {silent: true, sort: false});
            return true;
        },
        /**
         * @method next
         * @returns {Boolean}
         */
        next: function() {
            if (this.isLast())
                return false;
            this.set('position', this.get('position') + 1, {silent: true, sort: false});
            return true;
        },
        /**
         * @method save
         * @param {Function} callback
         */
        save: function(callback) {
            var reviews = this.get('reviews');
            var i, length, item, review, vocab;
            if (skritter.user.data.reviews.get(this)) {
                //updates the base review based on contained reviews
                if (this.hasContained()) {
                    reviews[0].reviewTime = this.getTotalReviewTime();
                    reviews[0].thinkingTime = this.getTotalThinkingTime();
                }
                //updates all of the new review intervals and items
                for (i = 0, length = reviews.length; i < length; i++) {
                    item = this.getItemAt(i);
                    vocab = this.getVocabAt(i);
                    review = reviews[i];
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
                    skritter.user.scheduler.update(item, vocab);
                }
            } else {
                //updates the base review based on contained reviews
                if (this.hasContained()) {
                    reviews[0].reviewTime = this.getTotalReviewTime();
                    reviews[0].thinkingTime = this.getTotalThinkingTime();
                }
                //updates all of the new review intervals and items
                for (i = 0, length = reviews.length; i < length; i++) {
                    item = this.getItemAt(i);
                    vocab = this.getVocabAt(i);
                    review = reviews[i];
                    if (parseInt(i, 10) === 0 && reviews.length > 1)
                        review.score = this.getFinalScore();
                    review.newInterval = skritter.user.scheduler.calculateInterval(item, review.score);
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
                    skritter.user.scheduler.update(item, vocab);
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
                skritter.user.scheduler.sort();
                skritter.user.scheduler.cache();
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
            position = position ? position : this.get('position');
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