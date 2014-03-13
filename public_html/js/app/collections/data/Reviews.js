/**
 * @module Skritter
 * @submodule Collections
 * @param Review
 * @author Joshua McFarland
 */
define([
    'models/data/Review'
], function(Review) {
    /**
     * @class DataReviews
     */
    var Reviews = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('add change', function(review) {
                review.cache();
            });
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Review,
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            skritter.storage.getAll('reviews', function(reviews) {
                self.add(reviews, {merge: true, silent: true});
                callback();
            });
        }
    });

    return Reviews;
});