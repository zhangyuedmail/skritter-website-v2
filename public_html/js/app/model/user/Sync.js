define([
], function() {
    /**
     * @class UserSync
     */
    var Sync = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.syncing = false;
            this.on('change', _.bind(this.cache, this));
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            addItemOffset: 0,
            lastErrorCheck: 0,
            lastItemSync: 0,
            lastSRSConfigSync: 0,
            lastVocabSync: 0
        },
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem(skritter.user.id + '-sync', JSON.stringify(this.toJSON()));
        },
        /**
         * @method addItems
         * @param {Number} limit
         * @param {Function} callback
         */
        addItems: function(limit, callback) {
            var self = this;
            var now = skritter.fn.getUnixTime();
            var numVocabsAdded = 0;
            var offset = this.get('addItemOffset');
            var requests = {
                path: 'api/v' + skritter.api.get('version') + '/items/add',
                method: 'POST',
                params: {
                    lang: skritter.settings.getLanguageCode(),
                    limit: limit,
                    offset: offset
                }
            };
            async.waterfall([
                function(callback) {
                    skritter.api.requestBatch(requests, function(batch, status) {
                        if (status === 200) {
                            callback(null, batch);
                        } else {
                            callback(batch);
                        }
                    });
                },
                function(batch, callback) {
                    function request() {
                        skritter.api.getBatch(batch.id, function(result, status) {
                            if (result && status === 200) {
                                if (result.Items) {
                                    skritter.user.scheduler.insert(result.Items);
                                }
                                numVocabsAdded += result.numVocabsAdded;
                                window.setTimeout(request, 2000);
                            } else {
                                self.set('addItemOffset', offset + numVocabsAdded);
                                callback();
                            }
                        });
                    }
                    request();
                },
                function(callback) {
                    self.changedItems(callback, now, true);
                }
            ], function() {
                skritter.user.scheduler.sort();
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method changedItems
         * @param {Function} callback
         * @param {Number} offset
         * @param {Boolean} includeResources
         */
        changedItems: function(callback, offset, includeResources) {
            offset = offset ? offset : this.get('lastItemSync');
            var requests = [
                {
                    path: 'api/v' + skritter.api.get('version') + '/items',
                    method: 'GET',
                    params: {
                        lang: skritter.settings.getLanguageCode(),
                        sort: 'changed',
                        offset: offset,
                        include_vocabs: includeResources ? 'true' : 'false',
                        include_strokes: includeResources ? 'true' : 'false',
                        include_sentences: includeResources ? 'true' : 'false',
                        include_heisigs: includeResources ? 'true' : 'false',
                        include_top_mnemonics: includeResources ? 'true' : 'false',
                        include_decomps: includeResources ? 'true' : 'false'
                    },
                    spawner: true
                }
            ];

            async.series([
                async.apply(this.processBatch, requests)
            ], _.bind(function() {
                callback();
            }, this));
        },
        /**
         * @method downloadAccount
         * @param {Function} callback
         */
        downloadAccount: function(callback) {
            var now = skritter.fn.getUnixTime();
            var lang = skritter.settings.getLanguageCode();
            var requests = [
                {
                    path: 'api/v' + skritter.api.get('version') + '/items',
                    method: 'GET',
                    params: {
                        lang: lang,
                        sort: 'changed',
                        offset: 0,
                        include_vocabs: 'true',
                        include_strokes: 'true',
                        include_sentences: 'true',
                        include_heisigs: 'true',
                        include_top_mnemonics: 'true',
                        include_decomps: 'true'
                    },
                    spawner: true
                },
                {
                    path: 'api/v' + skritter.api.get('version') + '/srsconfigs',
                    method: 'GET',
                    params: {lang: lang}
                }
            ];
            async.series([
                async.apply(this.processBatch, requests)
            ], _.bind(function() {
                this.set({
                    lastErrorCheck: now,
                    lastItemSync: now,
                    lastSRSConfigSync: now,
                    lastVocabSync: now
                });
                callback();
            }, this));
        },
        /**
         * @method processBatch
         * @param {Array} requests
         * @param {Function} callback
         */
        processBatch: function(requests, callback) {
            var downloadedRequests = 0;
            var responseSize = 0;
            async.waterfall([
                function(callback) {
                    skritter.api.requestBatch(requests, function(batch, status) {
                        if (status === 200) {
                            callback(null, batch);
                        } else {
                            callback(batch);
                        }
                    });
                },
                function(batch, callback) {
                    function request() {
                        skritter.api.getBatch(batch.id, function(result, status) {
                            if (result && status === 200) {
                                downloadedRequests += result.downloadedRequests;
                                responseSize += result.responseSize;
                                if (responseSize > 0)
                                    skritter.modal.set('.modal-title-right', skritter.fn.bytesToSize(responseSize));
                                if (result.totalRequests > 100)
                                    skritter.modal.progress(Math.round((downloadedRequests / result.totalRequests) * 100));
                                skritter.user.data.insert(result, function() {
                                    window.setTimeout(request, 1000);
                                });
                            } else {
                                callback();
                            }
                        });
                    }
                    request();
                }
            ], function() {
                callback();
            });
        },
        /**
         * @method reviews
         * @param {Function} callback
         */
        reviews: function(callback) {
            var lastErrorCheck = this.get('lastErrorCheck');
            var reviews = skritter.user.data.reviews.getReviewArray();
            async.waterfall([
                function(callback) {
                    skritter.api.getReviewErrors(lastErrorCheck, function(errors, status) {
                        if (status === 200 && errors.length > 0) {
                            alert('REVIEW ERRORS DETECTED!');
                            console.log('REVIEW ERRORS', errors);
                            callback(null, errors);
                        } else if (status === 200) {
                            callback();
                        } else {
                            callback(errors);
                        }
                    });
                },
                function(callback) {
                    skritter.api.postReviews(reviews, function(postedReviews, status) {
                        if (status === 200) {
                            callback(null, _.uniq(_.pluck(postedReviews, 'wordGroup')));
                        } else {
                            callback(postedReviews);
                        }
                    });
                    
                },
                function(postedReviewIds, callback) {
                    skritter.storage.remove('reviews', postedReviewIds, function() {
                        skritter.user.data.reviews.remove(postedReviewIds);
                        callback();
                    });
                }
            ], function() {
                callback();
            });
        },
        /**
         * @method srsconfigs
         * @param {Function} callback
         */
        srsconfigs: function(callback) {
            skritter.api.getSRSConfigs(skritter.settings.getLanguageCode(), function(srsconfigs, status) {
                if (status === 200) {
                    skritter.user.data.srsconfigs.reset();
                    skritter.user.data.srsconfigs.add(srsconfigs, {merge: true, silent: true});
                    skritter.user.data.srsconfigs.insert(srsconfigs, callback);
                } else {
                    callback();
                }
            });
        }
    });

    return Sync;
});