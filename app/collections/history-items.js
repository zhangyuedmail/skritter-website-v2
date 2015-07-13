var GelatoCollection = require('gelato/modules/collection');
var HistoryItem = require('models/history-item');

/**
 * @class ScheduleItems
 * @extends {GelatoCollection}
 */
module.exports = GelatoCollection.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.checking = false;
        this.syncing = false;
        this.on('add', this.handleAdd);
    },
    /**
     * @property model
     * @type {HistoryItems}
     */
    model: HistoryItem,
    /**
     * @method comparator
     * @param {HistoryItem} item
     * @return {Number}
     */
    comparator: function(item) {
        return -item.id;
    },
    /**
     * @method checkReviews
     * @param {Function} [callbackSuccess]
     * @param {Function} [callbackError]
     */
    checkReviews: function(callbackSuccess, callbackError) {
        var last = app.get('lastReviewCheck');
        var now = moment().unix();
        if (this.checking) {
            if (typeof callbackSuccess === 'function') {
                callbackSuccess();
            }
        } else {
            app.api.fetchReviewErrors(last, function(result) {
                console.error('REVIEW ERRORS:', result);
                if (result.length) {
                    if (typeof callbackError === 'function') {
                        callbackError(result);
                    }
                    app.set('lastReviewCheck', now);
                    if (typeof callbackSuccess === 'function') {
                        callbackSuccess();
                    }
                }
            }, function(error) {
                console.error('REVIEW ERROR:', error);
                if (typeof callbackError === 'function') {
                    callbackError(error);
                }
            });
        }
    },
    /**
     * @method handleAdd
     */
    handleAdd: function() {
        this.save();
    },
    /**
     * @method save
     * @param {Number} [startFrom]
     * @param {Function} [callbackSuccess]
     * @param {Function} [callbackError]
     */
    save: function(startFrom, callbackSuccess, callbackError) {
        var self = this;
        var reviews = this.slice(startFrom || 0, Number.MAX_VALUE);
        if (this.syncing) {
            if (typeof callbackSuccess === 'function') {
                callbackSuccess();
            }
        } else {
            async.eachSeries(reviews, function(review, callback) {
                self.syncing = true;
                app.api.postReviews(review.get('reviews'), function() {
                    self.remove(review);
                    callback();
                }, function(error) {
                    callback(error);
                });
            }, function(error) {
                self.syncing = false;
                if (error) {
                    if (typeof callbackError === 'function') {
                        callbackError(error);
                    }
                } else {
                    if (typeof callbackSuccess === 'function') {
                        callbackSuccess();
                    }
                }
            });
        }
    }
});
