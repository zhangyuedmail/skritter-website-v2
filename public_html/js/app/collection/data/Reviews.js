define([
    'model/data/Review'
], function(Review) {
    /**
     * @class DataReviews
     */
    var Collection = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Review,
        /**
         * @method comparator
         * @param {Backbone.Model} review
         * @returns {Number}
         */
        comparator: function(review) {
            return -review.attributes.reviews[0].submitTime;
        },
        /**
         * @method getReviewArray
         * @return {Array}
         */
        getReviewArray: function() {
            var reviews = [];
            for (var i = 1, length = this.length; i < length; i++) {
                reviews = reviews.concat(this.at(i).attributes.reviews);
            }
            return reviews;
        },
        /**
         * @method getReviewCount
         * @return {Number}
         */
        getReviewCount: function() {
            return this.getReviewArray().length;
        },
        /**
         * @method getTotalTime
         * @returns {Number}
         */
        getTotalTime: function() {
            var totalTime = 0;
            for (var i = 0, length = this.length; i < length; i++) {
                totalTime += this.at(i).get('reviews')[0].reviewTime;
            }
            return totalTime;
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('reviews', _.bind(function(reviews) {
                this.add(reviews, {merge: true, silent: true});
                callback();
            }, this));
        },
        /**
         * @method save
         * @param {Function} callback
         */
        save: function(callback) {
            var now = skritter.fn.getUnixTime();
            var lastErrorCheck = this.get('lastErrorCheck');
            var reviews = skritter.user.data.reviews.getReviewArray();
            async.waterfall([
                function(callback) {
                    skritter.api.checkReviewErrors(lastErrorCheck, function(reviewErrors, status) {
                        if (status === 200 && reviewErrors.length === 0) {
                            callback();
                        } else if (status === 200) {
                            //TODO: update handling for review errors
                        } else {
                            callback(reviewErrors);
                        }
                    });
                },
                function(callback) {
                    if (reviews.length > 0) {
                        console.log('posting reviews', reviews);
                        skritter.api.postReviews(reviews, function(postedReviews, status) {
                            if (status === 200) {
                                callback(null, postedReviews);
                            } else if (status === 403) {
                                callback(postedReviews);
                            } else {
                                //TODO: handle review format errors
                                callback(postedReviews);
                            }
                        });
                    } else {
                        callback(null, []);
                    }
                },
                function(postedReviews, callback) {
                    var reviewIds = _.uniq(_.pluck(postedReviews, 'wordGroup'));
                    if (reviewIds.length > 0) {
                        skritter.storage.remove('reviews', reviewIds, function() {
                            skritter.user.data.reviews.remove(reviewIds);
                            callback();
                        });
                    } else {
                        callback();
                    }
                }
            ], _.bind(function() {
                this.set({
                    lastErrorCheck: now,
                    lastReviewSync: now
                });
                this.active.reviews = false;
                if (typeof callback === 'function') {
                    callback();
                }
            }, this));
        }
    });

    return Collection;
});