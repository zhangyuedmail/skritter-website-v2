/**
 * @module Skritter
 * @submodule Collections
 * @param Sentence
 * @author Joshua McFarland
 */
define([
    'model/data/Sentence'
], function(Sentence) {
    /**
     * @class DataSentences
     */
    var Sentences = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Sentence,
        /**
         * @method insert
         * @param {Array|Object} sentences
         * @param {Function} callback
         */
        insert: function(sentences, callback) {
            skritter.storage.put('sentences', sentences, callback);
            sentences = null;
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('sentences', _.bind(function(sentences) {
                this.add(sentences, {merge: true, silent: true, sort: false});
                callback();
            }, this));
        }
    });

    return Sentences;
});