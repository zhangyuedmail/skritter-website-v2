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
            return -item.attributes.timestamp;
        },
        /**
         * @method exclude
         * @param {Array|String} ids
         * @returns {Array}
         */
        exclude: function(ids) {
            ids = Array.isArray(ids) ? ids : [ids];
            return this.filter(function(review) {
                return ids.indexOf(review.id) === -1;
            });
        },
        /**
         * @method getBatch
         * @returns {Array}
         */
        getBatch: function() {
            return this.exclude(this.at(0).id).map(function(review) {
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
         * @method canBeNext
         * @param {DataItem|ScheduleItem} item
         * @param {Number} [max]
         * @returns {Boolean}
         */
        isRecent: function(item, max) {
            var itemVocabIds = item ? item.get('vocabIds') : [];
            var reviewVocabIds = [];
            for (var i = 0, length = max || 1; i < length; i++) {
                var review = this.at(i);
                if (review) {
                    reviewVocabIds = reviewVocabIds.concat(review.get('vocabIds'));
                } else {
                    break;
                }
            }
            return _.intersection(itemVocabIds, reviewVocabIds).length ? true : false;
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
            var batch = this.getBatch();
            app.api.postReviews(batch, function(posted) {
                console.log('POSTED:', posted);
                callback();
            }, function(error, posted) {
                console.error('POST ERROR', error, posted);
                callback(error);
            });
        }
    });

    return DataReviews;
});
