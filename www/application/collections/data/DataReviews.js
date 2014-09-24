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
         * @method cacheById
         * @param {Array|String} ids
         * @param {Function} [callback]
         */
        cacheById: function(ids, callback) {
            ids = Array.isArray(ids) ? ids : [ids];
            app.storage.putItems('reviews', this.filter(function(review) {
                return ids.indexOf(review.id) !== -1;
            }).map(function(review) {
                return review.toJSON();
            }), function() {
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
            return this.getNotPosted().slice(1).map(function(review) {
                return review.attributes.reviews;
            });
        },
        /**
         * @method getPosted
         * @returns {Array}
         */
        getPosted: function() {
            return this.filter(function(review) {
                return review.attributes.posted;
            });
        },
        /**
         * @method getNotPosted
         * @returns {Array}
         */
        getNotPosted: function() {
            return this.filter(function(review) {
                return !review.attributes.posted;
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
         * @method markPosted
         * @param {Array|String} ids
         * @returns {Array}
         */
        markPosted: function(ids) {
            var marked = [];
            ids = Array.isArray(ids) ? ids : [ids];
            for (var i = 0, length = ids.length; i < length; i++) {
                marked.push(this.get(ids[i]).set('posted', true));
            }
            return marked;
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
                self.markPosted(postedIds);
                self.cacheById(postedIds, callback);
            }, function(error, posted) {
                console.error('POST ERROR:', error, posted);
                callback(error);
            });
        }
    });

    return DataReviews;
});
