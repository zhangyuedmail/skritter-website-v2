/**
 * @module Skritter
 * @submodule Collections
 * @param Vocab
 * @author Joshua McFarland
 */
define([
    'model/data/Vocab'
], function(Vocab) {
    /**
     * @class DataVocabs
     */
    var Vocabs = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @property {Vocab} model
         */
        model: Vocab,
        /**
         * @method insert
         * @param {Array|Object} vocabs
         * @param {Function} callback
         */
        insert: function(vocabs, callback) {
            skritter.storage.put('vocabs', vocabs, callback);
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('vocabs', _.bind(function(vocabs) {
                this.add(vocabs, {merge: true, silent: true, sort: false});
                callback();
            }. this));
        }
    });

    return Vocabs;
});