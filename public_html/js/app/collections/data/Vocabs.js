/**
 * @module Skritter
 * @submodule Collections
 * @param Vocab
 * @author Joshua McFarland
 */
define([
    'models/data/Vocab'
], function(Vocab) {
    /**
     * @class DataVocabs
     */
    var Vocabs = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change', function(vocab) {
                vocab.cache();
            });
        },
        /**
         * @property {Vocab} model
         */
        model: Vocab,
        /**
         * @method insert
         * @param {Array} vocabs
         * @param {Function} callback
         */
        insert: function(vocabs, callback) {
            var self = this;
            skritter.storage.put('vocabs', vocabs, function() {
                //self.add(vocabs, {merge: true, silent: true});
                callback();
            });
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            skritter.storage.getAll('vocabs', function(vocabs) {
                self.add(vocabs, {merge: true, silent: true});
                callback();
            });
        }
    });

    return Vocabs;
});