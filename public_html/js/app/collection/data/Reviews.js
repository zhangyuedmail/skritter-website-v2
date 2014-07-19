define([
    'model/data/Review'
], function(Review) {
    /**
     * @class DataReviews
     */
    var DataReviews = Backbone.Collection.extend({
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
         * @method getArray
         * @returns {Array}
         */
        getArray: function() {
            var reviews = [];
            for (var i = 0, length = this.length; i < length; i++) {
                reviews = reviews.concat(this.at(i).toJSON().reviews);
            }
            return reviews;
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
         * @method sync
         * @param {Function} callback
         */
        sync: function(callback) {
            skritter.api.postReviews(this.getArray(), function(result, status) {
                if (status === 200) {
                    var postedReviewIds = _.uniq(_.pluck(result, 'wordGroup'));
                    skritter.storage.remove('reviews', postedReviewIds, function () {
                        skritter.user.data.reviews.remove(postedReviewIds);
                        callback();
                    });
                } else if (status === 403) {
                    callback();
                } else if (status === 0){
                    callback(result);
                } else {
                    if (skritter.fn.hasRaygun()) {
                        try {
                            throw new Error('Review Format Error');
                        } catch (error) {
                            console.error('Review Format Error', result);
                            Raygun.send(error, {reviewFormatErrors: result});
                        }
                    }
                    callback(result);
                }
            });
        }
    });

    return DataReviews;
});