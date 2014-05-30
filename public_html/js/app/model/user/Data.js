define([
    'collection/data/Decomps',
    'collection/data/Items',
    'collection/data/Reviews',
    'collection/data/Sentences',
    'collection/data/SRSConfigs',
    'collection/data/Strokes',
    'collection/data/VocabLists',
    'collection/data/Vocabs'
], function(Decomps, Items, Reviews, Sentences, SRSConfigs, Strokes, VocabLists, Vocabs) {
    /**
     * @class UserData
     */
    var Model = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.decomps = new Decomps();
            this.items = new Items();
            this.reviews = new Reviews();
            this.sentences = new Sentences();
            this.srsconfigs = new SRSConfigs();
            this.strokes = new Strokes();
            this.vocablists = new VocabLists();
            this.vocabs = new Vocabs();
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
        },
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem(skritter.user.id + '-data', JSON.stringify(this.toJSON()));
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            async.series([
//                function(callback) {
//                    skritter.user.data.decomps.loadAll(callback);
//                },
                function(callback) {
                    skritter.user.data.items.loadAll(callback);
                },
                function(callback) {
                    skritter.user.data.reviews.loadAll(callback);
                },
//                function(callback) {
//                    skritter.user.data.sentences.loadAll(callback);
//                },
                function(callback) {
                    skritter.user.data.srsconfigs.loadAll(callback);
                },
//                function(callback) {
//                    skritter.user.data.strokes.loadAll(callback);
//                },
                function(callback) {
                    skritter.user.data.vocablists.loadAll(callback);
                },
//                function(callback) {
//                    skritter.user.data.vocabs.loadAll(callback);
//                }
            ], function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method put
         * @param {Object} result
         * @param {Function} callback
         */
        put: function(result, callback) {
            async.series([
                function(callback) {
                    skritter.storage.put('decomps', result.Decomps, callback);
                },
                function(callback) {
                    skritter.storage.put('items', result.Items, callback);
                },
                function(callback) {
                    skritter.storage.put('reviews', result.Reviews, callback);
                },
                function(callback) {
                    skritter.storage.put('sentences', result.Sentences, callback);
                },
                function(callback) {
                    skritter.storage.put('srsconfigs', result.SRSConfigs, callback);
                },
                function(callback) {
                    skritter.storage.put('strokes', result.Strokes, callback);
                },
                function(callback) {
                    skritter.storage.put('vocablists', result.VocabLists, callback);
                },
                function(callback) {
                    skritter.storage.put('vocabs', result.Vocabs, callback);
                }
            ], function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        }
    });
    
    return Model;
});