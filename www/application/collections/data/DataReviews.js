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
            this.current = undefined;
            this.previous = undefined;
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
         * @method checkErrors
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        checkErrors: function(callbackSuccess, callbackError) {
            var self = this;
            var now = moment().unix();
            async.waterfall([
                //check server for posted review errors
                function(callback) {
                    app.api.getReviewErrors(self.user.data.get('lastErrorCheck'), function(errors) {
                        if (errors && errors.length) {
                            try {
                                throw new Error('Review Errors');
                            } catch (error) {
                                console.log('REVIEW ERRORS:', errors);
                                raygun.send(error, {ReviewErrors: errors});
                            }
                            callback(null, errors);
                        } else {
                            callback(null, []);
                        }
                    }, function(error) {
                        callback(error);
                    });
                },
                //fix review error conflicts by downloading fresh item
                function(errors, callback) {
                    if (errors && errors.length) {
                        var itemIds = _.pluck(errors, 'itemId');
                        app.api.getItemById(itemIds, null, function(result) {
                            console.log('FIXING ERRORS:', itemIds);
                            if (result && result.length) {
                                app.user.schedule.insert(result.Items);
                            }
                            self.user.data.put(result, function() {
                                callback();
                            });
                        }, function() {
                            callback();
                        });
                    } else {
                        callback();
                    }
                }
            ], function(error) {
                if (error) {
                    callbackError();
                } else {
                    self.user.data.set('lastErrorCheck', now);
                    callbackSuccess();
                }
            });
        },
        /**
         * @method getTimerOffset
         * @returns {Number}
         */
        getTimerOffset: function() {
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
         * @method post
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        post: function(callbackSuccess, callbackError) {
            var self = this;
            var batch = this.getBatch();
            var postedIds;
            if (this.length > 1) {
                app.api.postReviews(batch, function(posted) {
                    postedIds = _.uniq(_.pluck(posted, 'wordGroup'));
                    app.storage.removeItems('reviews', postedIds, function() {
                        self.remove(postedIds);
                        callbackSuccess();
                    });
                }, function(error, posted) {
                    postedIds = _.uniq(_.pluck(posted, 'wordGroup'));
                    self.remove(postedIds);
                    console.error('POST ERROR:', error);
                    callbackError(error);
                });
            } else {
                callbackSuccess();
            }
        },
        /**
         * @method sync
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        sync: function(callbackSuccess, callbackError) {},
        /**
         * @method updateHistory
         * @param {DataReview} review
         */
        updateHistory: function(review) {
            this.user.history.add({
                id: review.id,
                base: review.id.split('-')[2],
                part: review.get('part'),
                timestamp: review.get('timestamp')
            }, {merge: true});
        }
    });

    return DataReviews;
});
