define([], function() {
    /**
     * @class DataReview
     */
    var DataReview = Backbone.Model.extend({
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
            position: 1,
            reviews: [],
            started: false
        },
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('reviews', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
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
         * @method getCharacter
         * @returns {Backbone.Collection}
         */
        getCharacter: function() {
            var position = this.get('position');
            if (this.characters) {
                return this.characters[position - 1];
            }
            return this.characters;
        },
        /**
         * @method getCharacterAt
         * @param {Number} position
         * @returns {Backbone.Collection}
         */
        getCharacterAt: function(position) {
            position = position ? position : this.get('position');
            if (this.characters) {
                return this.characters[position - 1];
            }
            return this.characters;
        },
        /**
         * @method getFinalScore
         * @returns {Number}
         */
        getFinalScore: function() {
            var reviews = this.get('reviews');
            var score = reviews[0].score;
            if (this.hasContained()) {
                var max = this.get('reviews').length - 1;
                var totalScore = 0;
                var totalWrong = 0;
                for (var i = 1, length = reviews.length; i < length; i++) {
                    var review = reviews[i];
                    totalScore += review.score;
                    if (review.score === 1) {
                        totalWrong++;
                    }
                }
                if (max === 2 && totalWrong === 1) {
                    score = 1;
                } else if (totalWrong > 1) {
                    score = 1;
                } else {
                    score = Math.floor(totalScore / max);
                }
            }
            return score;
        },
        /**
         * @method getItem
         * @returns {Backbone.Model}
         */
        getItem: function() {
            return skritter.user.data.items.get(this.getReview().itemId);
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
         * @method getMaxPosition
         * @returns {Number}
         */
        getMaxPosition: function() {
            if (this.hasContained()) {
                return this.get('reviews').length - 1;
            }
            return 1;
        },
        /**
         * @method getPosition
         * @returns {Number}
         */
        getPosition: function() {
            return this.get('position');
        },
        /**
         * @method getReview
         * @returns {Object}
         */
        getReview: function() {
            var position = this.get('position');
            if (this.hasContained() && position !== 0) {
                return this.get('reviews')[position];
            }
            return this.get('reviews')[0];
        },
        /**
         * @method getReviewAt
         * @param {Number} position
         * @returns {Object}
         */
        getReviewAt: function(position) {
            position = position || position === 0 ? position : this.get('position');
            if (this.hasContained() && position !== 0) {
                return this.get('reviews')[position];
            }
            return this.get('reviews')[0];
        },
        /**
         * @method getScore
         * @returns {Number}
         */
        getScore: function() {
            return this.getReview().score;
        },
        /**
         * @method getScoreAt
         * @param {Number} position
         * @returns {Number}
         */
        getScoreAt: function(position) {
            return this.getReviewAt(position).score;
        },
        /**
         * @method getTotalReviewTime
         * @returns {Number}
         */
        getTotalReviewTime: function() {
            var reviewTime = 0;
            if (this.hasContained()) {
                for (var i = 1, length = this.get('reviews').length; i < length; i++) {
                    reviewTime += this.get('reviews')[i].reviewTime;
                }
            } else {
                reviewTime = this.get('reviews')[0].reviewTime;
            }
            return reviewTime;
        },
        /**
         * @method getTotalThinkingTime
         * @returns {Number}
         */
        getTotalThinkingTime: function() {
            var thinkingTime = 0;
            if (this.hasContained()) {
                for (var i = 1, length = this.get('reviews').length; i < length; i++) {
                    thinkingTime += this.get('reviews')[i].thinkingTime;
                }
            } else {
                thinkingTime = this.get('reviews')[0].thinkingTime;
            }
            return thinkingTime;
        },
        /**
         * @method getVocab
         * @returns {Backbone.Model}
         */
        getVocab: function() {
            return skritter.user.data.items.get(this.getReview().itemId).getVocab();
        },
        /**
         * @method getVocabAt
         * @param {Number} position
         * @returns {Backbone.Model}
         */
        getVocabAt: function(position) {
            position = position || position === 0 ? position : this.get('position');
            return skritter.user.data.items.get(this.getReviewAt(position).itemId).getVocab();
        },
        /**
         * @method hasContained
         * @returns {Boolean}
         */
        hasContained: function() {
            return this.get('reviews').length > 1 ? true : false;
        },
        /**
         * @method isFinished
         * @returns {Boolean}
         */
        isFinished: function() {
            var position = this.get('position');
            var review = this.hasContained() ? this.get('reviews')[position] : this.get('reviews')[0];
            return review.finished;
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
         * @method load
         * @param {Function} callback
         */
        load: function(callback) {
            var itemId = this.get('reviews')[0].itemId;
            skritter.user.data.loadItem(itemId, _.bind(function(item) {
                var part = item.get('part');
                if (part === 'rune' || part === 'tone') {
                    this.characters = item.getCanvasCharacters();
                }
                callback(this);
            }, this));
        },
        /**
         * @method next
         * @returns {Boolean}
         */
        next: function() {
            if (this.isLast()) {
                return false;
            }
            this.set('position', this.get('position') + 1, {silent: true, sort: false});
            return true;
        },
        /**
         * @method previous
         * @returns {Boolean}
         */
        previous: function() {
            if (this.isFirst()) {
                return false;
            }
            this.set('position', this.get('position') - 1, {silent: true, sort: false});
            return true;
        },
        /**
         * @method save
         * @param {Function} callback
         */
        save: function(callback) {
            var self = this;
            var reviews = this.get('reviews');
            var srsconfigs = skritter.user.data.srsconfigs.get(this.get('part')).toJSON();
            async.series([
                function(callback) {
                    var items = [];
                    for (var i = 0, length = reviews.length; i < length; i++) {
                        var review = reviews[i];
                        var item = skritter.user.data.items.get(review.itemId);
                        if (reviews.length > 1 && i === 0) {
                            review.finished = true;
                            review.reviewTime = self.getTotalReviewTime();
                            review.score = self.getFinalScore();
                            review.thinkingTime = self.getTotalThinkingTime();
                        }
                        review.newInterval = skritter.fn.calculateInterval(item.toJSON(), review.score, srsconfigs);
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
                        });
                        items.push(item.toJSON());
                    }
                    skritter.user.scheduler.update(items);
                    skritter.user.scheduler.addHistory(items[0]);
                    callback();
                },
                function(callback) {
                    skritter.user.data.reviews.add(self, {merge: true});
                    self.cache(callback);
                },
                function(callback) {
                    skritter.user.data.items.cache(callback);
                }
            ], function() {
                skritter.user.scheduler.sort();
                callback();
            });
        },
        /**
         * @method setReview
         * @param {String|Object} key
         * @param {Array|Number|Object|String} value
         * @returns {Object}
         */
        setReview: function(key, value) {
            var position = this.get('position');
            var review = this.hasContained() ? this.get('reviews')[position] : this.get('reviews')[0];
            var data = {};
            if (typeof key === 'object') {
                data = key;
            } else {
                data[key] = value;
            }
            if (data) {
                for (var obj in data) {
                    review[obj] = data[obj];
                }
            }
            return review;
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
            if (data) {
                for (var obj in data) {
                    review[obj] = data[obj];
                }
            }
            return review;
        },
        /**
         * @method uncache
         * @param {Function} callback
         */
        uncache: function(callback) {
            skritter.storage.remove('reviews', this.id, function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        }
    });

    return DataReview;
});