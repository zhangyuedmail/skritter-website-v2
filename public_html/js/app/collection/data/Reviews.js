/**
 * @module Skritter
 * @submodule Collections
 * @param Review
 * @author Joshua McFarland
 */
define([
    'model/data/Review'
], function(Review) {
    /**
     * @class DataReviews
     */
    var Reviews = Backbone.Collection.extend({
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
         * @method getReviews
         * @param {Number} startFrom
         * @returns {Array}
         */
        getReviews: function(startFrom) {
            var reviews = [];
            startFrom = startFrom ? startFrom : 0;
            for (var i = startFrom, length = this.length; i < length; i++)
                reviews = reviews.concat(this.at(i).get('reviews'));
            return reviews;
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
         * @param {Number} startFrom
         * @param {Function} callback
         */
        save: function(callback, startFrom) {
            var reviews = this.getReviews(startFrom);
            if (reviews.length > 0) {
                async.waterfall([
                    function(callback) {
                        skritter.api.postReviews(reviews, function(posted, status) {
                            if (status === 200) {
                                callback(null, _.uniq(_.pluck(posted, 'wordGroup')));
                            } else {
                                callback(posted);
                            }
                        });
                    },
                    function(reviewIds, callback) {
                        skritter.storage.remove('reviews', reviewIds, function() {
                            callback(null, reviewIds);
                        });
                    }
                ], _.bind(function(error, reviewIds) {
                    if (error) {
                        alert('REVIEW ERRORS DETECTED!');
                        console.log('REVIEW ERRORS', reviewIds);
                    } else {
                        this.remove(reviewIds);
                    }
                    if (typeof callback === 'function')
                        callback();
                }, this));
            } else {
                callback();
            }
        }
    });

    return Reviews;
});