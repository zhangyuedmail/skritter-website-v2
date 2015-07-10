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
        this.syncing = false;
        this.on('add', this.handleAdd);
    },
    /**
     * @property model
     * @type {HistoryItems}
     */
    model: HistoryItem,
    /**
     * @method handleAdd
     */
    handleAdd: function() {
        if (this.length > 4) {
            this.save();
        }
    },
    /**
     * @method save
     * @param {Number} [startFrom]
     * @param {Function} [callbackSuccess]
     * @param {Function} [callbackError]
     */
    save: function(startFrom, callbackSuccess, callbackError) {
        var self = this;
        var reviews = this.slice(startFrom || 1, Number.MAX_VALUE);
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
