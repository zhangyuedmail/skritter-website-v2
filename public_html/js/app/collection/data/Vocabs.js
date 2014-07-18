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
            this.on('change', function(vocab) {
                skritter.user.data.get('changedVocabIds').push(vocab.id);
                skritter.user.data.cache();
                vocab.cache();
            });
        },
        /**
         * @property {Vocab} model
         */
        model: Vocab,
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('vocabs', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method fetchById
         * @param {Array|String} vocabIds
         * @param {Function} callback
         */
        fetchById: function(vocabIds, callback) {
            skritter.api.getVocabById(vocabIds, _.bind(function(vocabs, status) {
                if (status === 200) {
                    this.insert(vocabs,callback);
                } else {
                    callback(vocabs);
                }
            }, this));
        },
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
            }, this));
        }
    });

    return Vocabs;
});