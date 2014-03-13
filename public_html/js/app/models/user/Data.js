/**
 * @module Skritter
 * @submodule Models
 * @param Decomps
 * @param Items
 * @param Reviews
 * @param Sentences
 * @param SRSConfigs
 * @param Strokes
 * @param VocabLists
 * @param Vocabs
 * @author Joshua McFarland
 */
define([
    'collections/data/Decomps',
    'collections/data/Items',
    'collections/data/Reviews',
    'collections/data/Sentences',
    'collections/data/SRSConfigs',
    'collections/data/Strokes',
    'collections/data/VocabLists',
    'collections/data/Vocabs'
], function(Decomps, Items, Reviews, Sentences, SRSConfigs, Strokes, VocabLists, Vocabs) {
    /**
     * @class UserData
     */
    var Data = Backbone.Model.extend({
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
         * @method clear
         */
        clear: function() {
            this.decomps.reset();
            this.items.reset();
            this.reviews.reset();
            this.sentences.reset();
            this.strokes.reset();
            this.vocablists.reset();
            this.vocabs.reset();
        },
        /**
         * @method fetch
         * @param {Number} offset
         * @param {Function} callback
         */
        fetch: function(offset, callback) {
            async.waterfall([
                function(callback) {
                    skritter.api.requestBatch([{
                            path: 'api/v' + skritter.api.get('version') + '/items',
                            method: 'GET',
                            params: {
                                sort: 'changed',
                                offset: offset,
                                include_vocabs: 'true',
                                include_strokes: 'true',
                                include_sentences: 'true',
                                include_heisigs: 'true',
                                include_top_mnemonics: 'true',
                                include_decomps: 'true'
                            },
                            spawner: true
                        }], function(batch) {
                        callback(null, batch);
                    });
                },
                function(batch, callback) {
                    var next = function() {
                        skritter.api.getBatch(batch.id, function(result) {
                            if (result) {
                                async.series([
                                    function(callback) {
                                        skritter.user.data.decomps.insert(result.Decomps, callback);
                                    },
                                    function(callback) {
                                        skritter.user.data.items.insert(result.Items, callback);
                                    },
                                    function(callback) {
                                        skritter.user.data.srsconfigs.insert(result.SRSConfigs, callback);
                                    },
                                    function(callback) {
                                        skritter.user.data.sentences.insert(result.Sentences, callback);
                                    },
                                    function(callback) {
                                        skritter.user.data.strokes.insert(result.Strokes, callback);
                                    },
                                    function(callback) {
                                        skritter.user.data.vocabs.insert(result.Vocabs, callback);
                                    }
                                ], function() {
                                    window.setTimeout(next, 500);
                                });
                            } else {
                                callback();
                            }
                        });
                    };
                    next();
                }
            ], function() {
                console.log('SYNC COMPLETE!!!');
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            async.series([
                function(callback) {
                    self.decomps.loadAll(callback);
                },
                function(callback) {
                    self.items.loadAll(callback);
                },
                function(callback) {
                    self.reviews.loadAll(callback);
                },
                function(callback) {
                    self.sentences.loadAll(callback);
                },
                function(callback) {
                    self.srsconfigs.loadAll(callback);
                },
                function(callback) {
                    self.strokes.loadAll(callback);
                },
                function(callback) {
                    self.vocablists.loadAll(callback);
                },
                function(callback) {
                    self.vocabs.loadAll(callback);
                }
            ], callback);
        },
        /**
         * @method total
         * @returns {Number}
         */
        total: function() {
            var total = this.decomps.length;
            total += this.items.length;
            total += this.reviews.length;
            total += this.sentences.length;
            total += this.strokes.length;
            total += this.vocablists.length;
            return total + this.vocabs.length;
        }
    });

    return Data;
});