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
         * @method getReviewArray
         * @return {Array}
         */
        getReviewArray: function() {
            var reviews = [];
            for (var i = 0, length = this.length; i < length; i++) {
                reviews = reviews.concat(this.models[i].attributes.reviews);
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