/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @method UserSync
     */
    var Sync = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            //stores user sync to localStorage when they are changed
            this.on('change', this.cache);
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            last: 0
        },
        /**
         * @method cache
         * @param {Object} event
         */
        cache: function(event) {
            localStorage.setItem(skritter.user.id + '-sync', JSON.stringify(event.toJSON()));
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
        }
    });

    return Sync;
});