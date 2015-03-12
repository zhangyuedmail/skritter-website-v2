/**
 * @module Application
 */
define([
    'core/modules/GelatoCollection',
    'modules/models/DataVocabList'
], function(GelatoCollection, DataVocabList) {

    /**
     * @class DataVocabLists
     * @extend GelatoCollection
     */
    var DataVocabLists = GelatoCollection.extend({
        /**
         * @method initialize
         * @param {Array} [models]
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(models, options) {
            options = options || {};
        },
        /**
         * @property model
         * @type DataVocabList
         */
        model: DataVocabList,
        /**
         * @method
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        fetch: function(callbackSuccess, callbackError) {
            var self = this;
            (function next(cursor) {
                app.api.fetchVocabLists({
                    cursor: cursor,
                    lang: app.user.getLanguageCode(),
                    sort: 'studying'
                }, function(result) {
                    self.add(result.VocabLists, {merge: true});
                    if (result.cursor) {
                        next(result.cursor);
                    } else {
                        callbackSuccess(self);
                    }
                }, function(error) {
                    callbackError(error);
                });
            })();
        },
        /**
         * @method getByAdding
         * @returns {Array}
         */
        getByAdding: function() {
            return this.filter(function(list) {
                return list.get('studyingMode') === 'adding';
            });
        },
        /**
         * @method getByReviewing
         * @returns {Array}
         */
        getByReviewing: function() {
            return this.filter(function(list) {
                return list.get('studyingMode') === 'reviewing';
            });
        }
    });

    return DataVocabLists;

});