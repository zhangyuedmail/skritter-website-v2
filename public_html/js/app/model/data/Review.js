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
            audioPlayed: false,
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
         * @method at
         * @param {Object} data
         * @returns {Object}
         */
        at: function(data) {
            var review = this.get('reviews').length === 1 ? this.get('reviews')[0] : this.get('reviews')[this.get('position')];
            if (data)
                for (var key in data)
                    review[key] = data[key];
            return review;
        },
        /**
         * @method baseItem
         * @returns {Backbone.Model}
         */
        baseItem: function() {
            return skritter.user.data.items.get(this.get('reviews')[0].itemId);
        },
        /**
         * @method baseVocab
         * @returns {Backbone.Model}
         */
        baseVocab: function() {
            return this.baseItem().vocab();
        },
        /**
         * @method character
         * @returns {Backbone.Collection}
         */
        character: function() {
            return this.characters && this.hasContained() ? this.characters[this.get('position') - 1] : this.characters[0];
        },
        /**
         * @method finalGrade
         * @returns {Number}
         */
        finalGrade: function() {
            var grade = this.get('reviews')[0].score;
            if (this.hasContained()) {
                var max = this.get('reviews').length - 1;
                var totalGrade = 0;
                var totalWrong = 0;
                for (var i = 1, length = this.get('reviews').length; i < length; i++) {
                    var review = this.get('reviews')[i];
                    totalGrade += review.score;
                    if (review.score === 1)
                        totalWrong++;
                }
                if (max === 2 && totalWrong === 1) {
                    grade = 1;
                } else if (totalWrong > 1) {
                    grade = 1;
                } else {
                    grade = Math.floor(totalGrade / max);
                }
            }
            return grade;
        },
        /**
         * @method hasContained
         * @returns {Boolean}
         */
        hasContained: function() {
            return this.get('reviews').length > 1 ? true : false;
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
            var actualPosition = this.get('reviews').length === 1 ? 1 : this.get('reviews').length - 1;
            return this.get('position') === actualPosition ? true : false;
        },
        /**
         * @method item
         * @param {Number} position
         * @returns {Backbone.Model}
         */
        item: function(position) {
            if (typeof position !== 'number')
                position = this.hasContained() ? this.get('position') : 0;
            return skritter.user.data.items.get(this.get('reviews')[position].itemId);
        },
        /**
         * @method load
         * @param {Function} callback
         */
        load: function(callback) {
            var part = this.get('part');
            skritter.user.data.loadItem(this.originalBaseItem().id, _.bind(function(item) {
                if (part === 'rune' || part === 'tone') {
                    this.characters = [];
                    var reviews = this.get('reviews');
                    for (var i = 0, length = reviews.length; i < length; i++) {
                        if (reviews.length === 1) {
                            this.characters.push(this.item(i).stroke().canvasCharacter());
                        } else if (i > 0) {
                            this.characters.push(this.item(i).stroke().canvasCharacter());
                        }
                    }
                    callback(item);
                } else {
                    callback(item);
                }
            }, this));
        },
        /**
         * @method next
         * @returns {Number}
         */
        next: function() {
            if (this.isLast())
                return this.get('position');
            return this.set('position', this.attributes.position + 1).get('position');
        },
        /**
         * @method originalBaseItem
         * @returns {Object}
         */
        originalBaseItem: function() {
            return this.get('originalItems')[0];
        },
        /**
         * @method originalItem
         * @returns {Object}
         */
        originalItem: function() {
            return this.get('originalItems').length === 1 ? this.get('originalItems')[0] : this.get('originalItems')[this.get('position')];
        },
        /**
         * @method previous
         * @returns {Number}
         */
        previous: function() {
            if (this.isFirst())
                return this.get('position');
            return this.set('position', this.attributes.position - 1).get('position');
        },
        /**
         * @method save
         * @param {Function} callback
         */
        save: function(callback) {
            var reviews = _.clone(this.get('reviews'));
            if (skritter.user.data.reviews.get(this)) {
                //TODO: handle updating historic items and reviews
            } else {
                //updates the base review based on contained reviews
                if (this.hasContained()) {
                    reviews[0].reviewTime = this.totalReviewTime();
                    reviews[0].thinkingTime = this.totalThinkingTime();
                }
                //updates all of the new review intervals
                for (var i = 0, length = reviews.length; i < length; i++) {
                    var item = this.item(i);
                    var review = reviews[i];
                    if (parseInt(i, 10) === 0 && reviews.length > 1)
                        review.score = this.finalGrade();
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
                    }, {merge: true, silent: true, sort: false});
                    skritter.user.data.items.updateSchedule(item);
                }
                //set the review data and trigger local caching
                this.set('reviews', reviews, {merge: true, silent: true, sort: false});
                skritter.user.data.reviews.add(this, {merge: false, silent: true, sort: true});
            }
            async.series([
                _.bind(function(callback) {
                    this.cache(callback);
                }, this),
                function(callback) {
                    skritter.user.data.items.cache(callback);
                }
            ], function() {
                callback();
            });
        },
        /**
         * @method totalReviewTime
         * @returns {Number}
         */
        totalReviewTime: function() {
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
         * @method totalThinkingTime
         * @returns {Number}
         */
        totalThinkingTime: function() {
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
         * @method uncache
         * @param {Function} callback
         */
        uncache: function(callback) {
            skritter.storage.remove('reviews', this.id, function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method vocab
         * @param {Number} position
         * @returns {Backbone.Model}
         */
        vocab: function(position) {
            if (typeof position !== 'number')
                return this.item().vocab();
            return this.item(position).vocab();
        }
    });

    return Review;
});