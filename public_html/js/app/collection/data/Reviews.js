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
        }
    });

    return Collection;
});