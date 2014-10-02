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
         * @param {Number} [startFrom]
         * @returns {Array}
         */
        getBatch: function(startFrom) {
            startFrom = startFrom === undefined ? 0 : startFrom;
            console.log('slicing batch from', startFrom);
            return this.slice(startFrom).map(function(review) {
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
                //use server time for reference
                function(callback) {
                    self.user.getServerTime(function(time) {
                        now = time;
                        callback();
                    });
                },
                //check server for posted review errors
                function(callback) {
                    app.api.getReviewErrors(self.user.data.get('lastErrorCheck'), function(errors) {
                        if (errors && errors.length) {
                            try {
                                throw new Error('Review Errors');
                            } catch (e) {
                                console.log('REVIEW ERRORS:', errors);
                                raygun.send(e, {ReviewErrors: errors});
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
                            if (result && result.Items.length) {
                                app.user.schedule.insert(result.Items);
                            }
                            self.user.data.put(result, callback);
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
         * @param {Number} startFrom
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        post: function(startFrom, callbackSuccess, callbackError) {
            var self = this;
            var batch = this.getBatch(startFrom);
            var postedIds;
            if (batch && batch.length) {
                app.api.postReviews(batch, function(posted) {
                    postedIds = _.uniq(_.pluck(posted, 'wordGroup'));
                    app.storage.removeItems('reviews', postedIds, function() {
                        self.remove(postedIds);
                        callbackSuccess();
                    });
                }, function(error, posted) {
                    postedIds = _.uniq(_.pluck(posted, 'wordGroup'));
                    try {
                        throw new Error('Review Format Errors');
                    } catch (e) {
                        console.log('REVIEW FORMAT ERRORS:', error.responseJSON);
                        raygun.send(e, {Response: error.responseJSON});
                    }
                    app.storage.clear('reviews', function() {
                        self.reset();
                        callbackError(error);
                    });
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
            //send changed review to history
            this.user.history.add({
                id: review.id,
                base: review.id.split('-')[2],
                part: review.get('part'),
                timestamp: review.get('timestamp')
            }, {merge: true});
            //check for enough reviews to sync
            if (this.length > 10) {
                this.user.data.sync(1);
            }
        }
    });

    return DataReviews;
});
