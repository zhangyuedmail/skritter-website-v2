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
            this.saving = false;
            this.on('add', _.bind(function() {
                if (!this.saving && skritter.user.settings.get('autoSync') &&
                        this.length >= skritter.user.settings.get('autoSyncThreshold')) {
                    this.save();
                }
            }, this));
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
         * @param {Number} startFrom
         * @return {Array}
         */
        getReviewArray: function(startFrom) {
            var reviews = [];
            for (var i = startFrom === undefined ? 1 : startFrom, length = this.length; i < length; i++) {
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
         * @param {Boolean} saveAll
         */
        save: function(callback, saveAll) {
            if (this.saving) {
                if (typeof callback === 'function') {
                    callback();
                }
            } else {
                this.saving = true;
                this.trigger('saving', true);
                var lastErrorCheck = skritter.user.sync.get('lastErrorCheck');
                var now = skritter.fn.getUnixTime();
                var reviews = this.getReviewArray(saveAll ? 0 : 1);
                async.waterfall([
                    function(callback) {
                        console.log('saving reviews', reviews);
                        skritter.api.postReviews(reviews, function(postedReviews, status) {
                            if (status === 200) {
                                callback(null, postedReviews);
                            } else if (status === 403) {
                                callback(postedReviews);
                            } else if (status === 0) {
                                callback(postedReviews);
                            } else {
                                if (skritter.fn.hasRaygun()) {
                                    try {
                                        throw new Error('Review Format Error');
                                    } catch (error) {
                                        console.error('Review Format Error', postedReviews);
                                        Raygun.send(error, {reviewFormatErrors: postedReviews});
                                    }
                                }
                                callback(postedReviews);
                            }
                        });
                    },
                    function(postedReviews, callback) {
                        var postedReviewIds = _.uniq(_.pluck(postedReviews, 'wordGroup'));
                        if (postedReviewIds.length > 0) {
                            skritter.storage.remove('reviews', postedReviewIds, function() {
                                skritter.user.data.reviews.remove(postedReviewIds);
                                callback();
                            });
                        } else {
                            callback();
                        }
                    },
                    function(callback) {
                        skritter.api.checkReviewErrors(lastErrorCheck, function(reviewErrors, status) {
                            if (status === 200 && reviewErrors.length > 0) {
                                if (skritter.fn.hasRaygun()) {
                                    try {
                                        throw new Error('Review Error');
                                    } catch (error) {
                                        console.error('Review Error', reviewErrors);
                                        Raygun.send(error, {reviewErrors: reviewErrors});
                                    }
                                }
                                callback(null, reviewErrors);
                            } else if (status === 200) {
                                callback(null, reviewErrors);
                            } else {
                                callback(reviewErrors);
                            }
                        });
                    },
                    function(reviewErrors, callback) {
                        var reviewErrorIds = _.uniq(_.pluck(reviewErrors, 'itemId'));
                        if (reviewErrorIds.length > 0) {
                            skritter.user.data.items.fetchById(reviewErrorIds, callback);
                        } else {
                            callback();
                        }
                    }
                ], _.bind(function() {
                    skritter.user.sync.set({
                        lastErrorCheck: now,
                        lastReviewSync: now
                    });
                    this.saving = false;
                    this.trigger('saving', false);
                    if (typeof callback === 'function') {
                        callback();
                    }
                }, this));
            }
        }
    });

    return Collection;
});