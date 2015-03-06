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
         * @param {Function} callback
         */
        fetch: function(callback) {
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
                        callback();
                    }
                }, function(error) {
                    callback(error);
                });
            })();
        }
    });

    return DataVocabLists;

});