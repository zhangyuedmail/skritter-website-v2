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
         * @method comparator
         * @param {Backbone.Model} review
         * @returns {Number}
         */
        comparator: function(review) {
            return -review.attributes.reviews[0].submitTime;
        },
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
        },
        /**
         * @method recentIds
         * @param {Number} number
         * @returns {Array}
         */
        recentIds: function(number) {
            number = number ? number : 5;
            if (this.models.length === 0)
                return [];
            return this.models.map(function(item) {
                return item.id.split('_')[1];
            }).slice(0, number - 1);
        },
        /**
         * @method totalTimeToday
         * @returns {Number}
         */
        totalTimeToday: function() {
            var totalTime = 0;
            var today = moment().subtract('hours', 3).format('YYYYMMDD');
            for (var a = 0, lengthA = this.length; a < lengthA; a++) {
                var review = this.at(a);
                if (moment(review.get('reviews')[0].submitTime * 1000).subtract('hours', 3).format('YYYYMMDD') === today)
                for (var b = 0, lengthB = review.get('reviews').length; b < lengthB; b++)
                    totalTime += review.get('reviews')[b].reviewTime;
            }
            return totalTime;
        }
    });

    return Reviews;
});