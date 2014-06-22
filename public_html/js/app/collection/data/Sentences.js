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
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('sentences', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method insert
         * @param {Array|Object} sentences
         * @param {Function} callback
         */
        insert: function(sentences, callback) {
            skritter.storage.put('sentences', sentences, callback);
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