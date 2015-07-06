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
    initialize: function() {},
    /**
     * @property model
     * @type {HistoryItems}
     */
    model: HistoryItem,
    /**
     * @method save
     * @param {Number} [startFrom]
     * @param {Function} [callbackSuccess]
     * @param {Function} [callbackError]
     */
    save: function(startFrom, callbackSuccess, callbackError) {
        var self = this;
        var reviews = this.slice(startFrom || 0, Number.MAX_VALUE);
        async.each(reviews, function(review, callback) {
            app.api.postReviews(review.get('reviews'), function() {
                self.remove(review);
                callback();
            }, function(error) {
                callback(error);
            });
        }, function(error) {
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
});
