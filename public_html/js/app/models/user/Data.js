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
            Data.syncing = false;
            this.decomps = new Decomps();
            this.items = new Items();
            this.reviews = new Reviews();
            this.sentences = new Sentences();
            this.srsconfigs = new SRSConfigs();
            this.strokes = new Strokes();
            this.vocablists = new VocabLists();
            this.vocabs = new Vocabs();
            this.on('change', this.cache);
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            lastSync: 0
        },
        /**
         * @method cache
         * @param {Object} event
         */
        cache: function(event) {
            localStorage.setItem(skritter.user.id + '-data', JSON.stringify(event.toJSON()));
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
         * @method fetchItems
         * @param {Number} offset
         * @param {Function} callback1
         * @param {Function} callback2
         */
        fetchItems: function(offset, callback1, callback2) {
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
                                if (typeof callback2 === 'function')
                                    callback2(result);
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
                if (typeof callback1 === 'function')
                    callback1();
            });
        },
        /**
         * @method fetchSRSConfigs
         * @param {Function} callback
         */
        fetchSRSConfigs: function(callback) {
            skritter.api.getSRSConfigs(function(srsconfigs) {
                skritter.user.data.srsconfigs.insert(srsconfigs, callback);
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
         * @method sync
         * @param {Function} callback
         * @param {Boolean} showModal
         */
        sync: function(callback, showModal) {
            var self = this;
            var downloadedRequests = 0;
            var lastSync = this.get('lastSync');
            var responseSize = 0;
            Data.syncing = true;
            console.log('SYNCING FROM', (lastSync === 0) ? 'THE BEGINNING OF TIME' : moment(lastSync * 1000).format('YYYY-MM-DD H:mm:ss'));
            if (showModal || lastSync === 0) {
                skritter.modals.show('download')
                        .set('.modal-title', lastSync === 0 ? 'INITIAL SYNC' : 'SYNC')
                        .set('.modal-title-right', 'Downloading')
                        .progress(100)
                        .set('.modal-footer', false);
            } else {
                callback();
            }
            async.series([
                //downloads all of the changed items and related data since last sync
                function(callback) {
                    self.fetchItems(lastSync, callback, function(result) {
                        downloadedRequests += result.downloadedRequests;
                        responseSize += result.responseSize;
                        if (responseSize > 0)
                            skritter.modals.set('.modal-title-right', '~' + skritter.fn.bytesToSize(responseSize));
                        if (result.totalRequests > 10 && result.runningRequests === 0)
                            skritter.modals.progress((downloadedRequests / result.totalRequests) * 100);
                    });
                },
                //downloads the latest configs for more accurate scheduling
                function(callback) {
                    self.fetchSRSConfigs(callback);
                }
            ], function() {
                console.log('FINISHED SYNCING AT', moment(skritter.fn.getUnixTime() * 1000).format('YYYY-MM-DD H:mm:ss'));
                if (showModal || lastSync === 0) {
                    skritter.modals.hide();
                    callback();
                }
                self.set('lastSync', skritter.fn.getUnixTime());
                Data.syncing = false;
            });
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