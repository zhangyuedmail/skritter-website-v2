/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/data/DataReview'
], function(BaseCollection, DataReview) {
    /**
     * @class DataReviews
     * @extend BaseCollection
     */
    var DataReviews = BaseCollection.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.current = undefined;
            this.previous = undefined;
        },
        /**
         * @property model
         * @type DataReview
         */
        model: DataReview,
        /**
         * @method comparator
         * @param {ScheduleItem} item
         * @returns {Number}
         */
        comparator: function(item) {
            return -item.id;
        },
        /**
         * @method flattenReviews
         * @param {Number} start
         * @param {Number} end
         * @returns {Array}
         */
        flattenReviews: function(start, end) {
            return _.flatten(this.models.map(function(review) {
                return review.attributes.reviews;
            }));
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
            var self = this;
            app.storage.getAll('reviews', function(data) {
                self.reset();
                self.lazyAdd(data, callback, {silent: true});
            });
        },
        /**
         * @method sync
         * @param {Function} callback
         */
        sync: function(callback) {
            app.api.postReviews(this.pluck('reviews'), function(posted) {
                console.log('POSTED:', posted);
            }, function(error, posted) {
                console.error('POST ERROR', error, posted);
            });
        }
    });

    return DataReviews;
});
