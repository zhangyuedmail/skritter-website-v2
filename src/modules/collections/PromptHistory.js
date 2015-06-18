/**
 * @module Application
 */
define([
    'core/modules/GelatoCollection',
    'modules/models/PromptHistoryItem'
], function(GelatoCollection, PromptHistoryItem) {

    /**
     * @class PromptHistory
     * @extends GelatoCollection
     */
    var PromptHistory = GelatoCollection.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.syncing = false;
            this.on('add change remove', this.cache);
        },
        /**
         * @property model
         * @type {PromptHistoryItem}
         */
        model: PromptHistoryItem,
        /**
         * @method comparator
         * @param {PromptHistoryItem} item
         * @returns {Number}
         */
        comparator: function(item) {
            return item.get('timestamp');
        },
        /**
         * @method cache
         * @returns {PromptHistory}
         */
        cache: function() {
            localStorage.setItem(app.user.getDataPath('history', true), JSON.stringify(this.toJSON()));
            return this;
        },
        /**
         * @method load
         * @returns {PromptHistory}
         */
        load: function() {
            var history = localStorage.getItem(app.user.getDataPath('history', true));
            if (history) {
                this.add(JSON.parse(history), {silent: true});
            }
            return this;
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
            if (!this.syncing) {
                this.syncing = true;
                Async.each(reviews, function(review, callback) {
                    console.log('SAVING REVIEW:', review);
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

    return PromptHistory;

});