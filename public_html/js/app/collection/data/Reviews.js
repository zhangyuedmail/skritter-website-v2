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
            this.on('add change', this.autoSync);
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
         * @method autoSync
         * @param {Backbone.Model} model
         * @param {Backbone.Collection} collection
         */
        autoSync: function(model, collection) {
            if (!skritter.user.data.get('syncing') &&
                collection.length > skritter.user.settings.get('autoSyncThreshold')) {
                skritter.user.data.sync();
            } else {
                console.log('no auto');
            }
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
                    skritter.storage.remove('reviews', postedReviewIds, function() {
                        skritter.user.data.reviews.remove(postedReviewIds);
                        callback();
                    });
                } else {
                    callback(result);
                }
            });
        }
    });

    return DataReviews;
});