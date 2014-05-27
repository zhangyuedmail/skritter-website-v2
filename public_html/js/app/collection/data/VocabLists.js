/**
 * @module Skritter
 * @submodule Collections
 * @param VocabList
 * @author Joshua McFarland
 */
define([
    'model/data/VocabList'
], function(VocabList) {
    /**
     * class DataVocabLists
     */
    var VocabLists = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @property {Backbone.Model} model
         */
        model: VocabList,
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('vocablists', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method clearCache
         * @param {Function} callback
         */
        clearCache: function(callback) {
            skritter.storage.clear('vocablists', function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method insert
         * @param {Array|Object} vocablists
         * @param {Function} callback
         */
        insert: function(vocablists, callback) {
            skritter.storage.put('vocablists', vocablists, callback);
            vocablists= null;
        },
        /**
         * @method comparator
         * @param {Backbone.Model} vocablist
         */
        comparator: function(vocablist) {
            if (vocablist.has('name') && vocablist.has('studyingMode')) {
                var studyingMode = vocablist.attributes.studyingMode;
                if (studyingMode === 'adding') {
                    return '1-' + vocablist.attributes.name;
                } else if (studyingMode === 'reviewing') {
                    return '2-' + vocablist.attributes.name;
                } else if (studyingMode === 'not studying') {
                    return '3-' + vocablist.attributes.name;
                } else {
                    return '4-' + vocablist.attributes.name;
                }
            } else if (vocablist.has('name')) {
                return vocablist.attributes.name;
            }
            return vocablist.id;
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('vocablists', _.bind(function(vocablists) {
                this.add(vocablists, {merge: true, silent: true, sort: false});
                callback();
            }, this));
        }
    });

    return VocabLists;
});