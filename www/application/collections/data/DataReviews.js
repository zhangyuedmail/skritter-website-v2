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
         * @param {Array} models
         * @param {Object} options
         * @constructor
         */
        initialize: function(models, options) {
            options = options ? options : {};
            this.user = options.user;
            this.on('add change', this.updateHistory);
        },
        /**
         * @property model
         * @type DataReview
         */
        model: DataReview,
        /**
         * @method cache
         * @param {Function} [callback]
         */
        cache: function(callback) {
            app.storage.putItems('reviews', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method comparator
         * @param {ScheduleItem} item
         * @returns {Number}
         */
        comparator: function(item) {
            return -item.attributes.timestamp;
        },
        /**
         * @method getBatch
         * @returns {Array}
         */
        getBatch: function() {
            return this.slice(1).map(function(review) {
                return review.attributes.reviews;
            });
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
                self.lazyAdd(data, callback, {silent: true, sort: false});
                self.sort();
            });
        },
        /**
         * @method sync
         * @param {Function} callback
         */
        sync: function(callback) {
            var self = this;
            var batch = this.getBatch();
            app.api.postReviews(batch, function(posted) {
                var postedIds = _.uniq(_.pluck(posted, 'wordGroup'));
                console.log('POST:', posted.length);
                app.storage.removeItems('reviews', postedIds, function() {
                    self.remove(postedIds);
                    callback();
                });
            }, function(error, posted) {
                console.error('POST ERROR:', error, posted);
                callback(error);
            });
        },
        /**
         * @method updateHistory
         * @param {DataReview} review
         */
        updateHistory: function(review) {
            this.user.history.add({
                id: review.id,
                part: review.get('part'),
                timestamp: review.get('timestamp')
            }, {merge: true});
        }
    });

    return DataReviews;
});
