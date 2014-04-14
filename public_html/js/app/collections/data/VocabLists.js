/**
 * @module Skritter
 * @submodule Collections
 * @param VocabList
 * @author Joshua McFarland
 */
define([
    'models/data/VocabList'
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
         * @method insert
         * @param {Array|Object} vocablists
         * @param {Function} callback
         */
        insert: function(vocablists, callback) {
            skritter.storage.put('vocablists', vocablists, callback);
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            skritter.storage.getAll('vocablists', function(vocablists) {
                self.add(vocablists, {merge: true, silent: true, sort: false});
                callback();
            });
        }
    });
    
    return VocabLists;
});