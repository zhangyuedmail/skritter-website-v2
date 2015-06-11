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
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        save: function(callbackSuccess, callbackError) {
            var self = this;
            Async.each(this.models, function(model, callback) {
                app.api.postReviews(model.get('reviews'), function() {
                    self.remove(model);
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

    return PromptHistory;

});