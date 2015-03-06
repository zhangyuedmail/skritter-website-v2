/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoCollection',
    'modules/models/DataVocab'
], function(GelatoCollection, DataVocab) {

    /**
     * @class DataVocabs
     * @extends GelatoCollection
     */
    var DataVocabs = GelatoCollection.extend({
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
         * @type DataVocab
         */
        model: DataVocab,
        /**
         * @method fetchByQuery
         * @param {String} writing
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        fetchByQuery: function(writing, callbackSuccess, callbackError) {
            var id = null;
            var vocab = null;
            Async.series([
                function(callback) {
                    app.api.fetchVocabs({
                        q: writing,
                        fields: 'id'
                    }, function(result) {
                        if (result.Vocabs.length) {
                            id = result.Vocabs[0].id;
                            callback();
                        } else {
                            callback(new Error('No vocabs found.'));
                        }
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    app.api.fetchVocabs({
                        ids: id,
                        include_decomps: true,
                        include_strokes: true
                    }, function(result) {
                        if (result.Vocabs.length) {
                            vocab = result.Vocabs[0];
                            app.user.data.add(result, callback);
                        } else {
                            callback(new Error('No vocabs found.'));
                        }
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    if (vocab.containedVocabIds) {
                        app.api.fetchVocabs({
                            q: writing,
                            ids: vocab.containedVocabIds.join('|'),
                            include_decomps: true,
                            include_strokes: true
                        }, function(result) {
                            app.user.data.add(result, callback);
                        }, function(error) {
                            callback(error);
                        });
                    } else {
                        callback();
                    }
                }
            ], function(error) {
                if (error) {
                    callbackError(error);
                } else {
                    callbackSuccess(app.user.data.vocabs.get(vocab.id));
                }
            });
        }
    });

    return DataVocabs;

});