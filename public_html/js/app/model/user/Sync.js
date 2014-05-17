/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class UserSync
     */
    var Sync = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.set('syncing', false);
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
            lastVocabSync: 0,
            syncing: false
        },
        /**
         * @method cache
         */
        cache: function() {
            var syncData = this.toJSON();
            delete syncData.syncing;
            localStorage.setItem(skritter.user.id + '-sync', JSON.stringify(syncData));
        },
        /**
         * @method addItems
         * @param {Number} limit
         * @param {Function} callback1
         * @param {Function} callback2
         */
        addItems: function(limit, callback1, callback2) {
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
            this.set('syncing', true);
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
                                if (result.numVocabsAdded) {
                                    numVocabsAdded += result.numVocabsAdded;
                                }
                                window.setTimeout(request, 2000);
                            } else {
                                if (typeof callback2 === 'function') {
                                    callback2(numVocabsAdded);
                                }
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
            ], _.bind(function() {
                skritter.user.scheduler.sort();
                this.set('syncing', false);
                if (typeof callback1 === 'function') {
                    callback1();
                }
            }, this));
        },
        /**
         * @method changedItems
         * @param {Function} callback
         * @param {Number} offset
         * @param {Boolean} includeResources
         */
        changedItems: function(callback, offset, includeResources) {
            if (this.isActive()) {
                callback();
                return false;
            }
            offset = offset ? offset : this.get('lastItemSync');
            var now = skritter.fn.getUnixTime();
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
            this.set('syncing', true);
            async.series([
                async.apply(this.processBatch, requests)
            ], _.bind(function() {
                this.set('lastItemSync', now);
                this.set('syncing', false);
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
            this.set('syncing', true);
            async.series([
                async.apply(this.processBatch, requests)
            ], _.bind(function() {
                this.set({
                    lastErrorCheck: now,
                    lastItemSync: now,
                    lastSRSConfigSync: now,
                    lastVocabSync: now
                });
                this.set('syncing', false);
                callback();
            }, this));
        },
        incremental: function(callback) {
            if (!this.isActive()) {
                skritter.modal.show('download')
                        .set('.modal-title', 'SYNCING')
                        .progress(100);
                async.series([
                    _.bind(function(callback) {
                        this.reviews(callback);
                    }, this),
                    _.bind(function(callback) {
                        this.changedItems(callback);
                    }, this)
                ], function() {
                    skritter.modal.hide();
                });
            }
        },
        /**
         * @method isActive
         * @return {Boolean}
         */
        isActive: function() {
            if (this.get('syncing')) {
                return true;
            }
            return false;
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
                                if (responseSize > 0) {
                                    skritter.modal.set('.modal-title-right', skritter.fn.bytesToSize(responseSize));
                                }
                                if (result.totalRequests > 100) {
                                    skritter.modal.progress(Math.round((downloadedRequests / result.totalRequests) * 100));
                                }
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
            if (this.isActive()) {
                callback();
                return false;
            }
            var lastErrorCheck = this.get('lastErrorCheck');
            var reviews = skritter.user.data.reviews.getReviewArray();
            console.log('POSTING REVIEWS', _.uniq(_.pluck(reviews, 'wordGroup')));
            this.set('syncing', true);
            async.waterfall([
                function(callback) {
                    skritter.api.getReviewErrors(lastErrorCheck, function(reviewErrors, status) {
                        if (status === 200 && reviewErrors.length > 0) {
                            console.log('REVIEW ERRORS', reviewErrors);
                            if (window.Raygun) {
                                try {
                                    throw new Error('Review Errors');
                                } catch (error) {
                                    Raygun.send(error, {
                                        reviewErrors: reviewErrors
                                    });
                                }
                            }
                            callback(reviewErrors);
                        } else if (status === 200) {
                            callback();
                        } else {
                            callback(reviewErrors);
                        }
                    });
                },
                function(callback) {
                    skritter.api.postReviews(reviews, function(postedReviews, status) {
                        if (status === 200) {
                            callback(null, _.uniq(_.pluck(postedReviews, 'wordGroup')));
                        } else {
                            if (window.Raygun) {
                                try {
                                    throw new Error('Review Format Errors');
                                } catch (error) {
                                    Raygun.send(error, {
                                        reviewFormatErrors: postedReviews.responseJSON
                                    });
                                }
                            }
                            //TODO: handle all and any problematic format errors
                            callback(null, postedReviews);
                        }
                    });
                },
                function(postedReviewIds, callback) {
                    skritter.storage.remove('reviews', postedReviewIds, function() {
                        skritter.user.data.reviews.remove(postedReviewIds);
                        callback();
                    });
                }
            ], _.bind(function() {
                this.set('syncing', false);
                if (typeof callback === 'function') {
                    callback();
                }
            }, this));
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
        },
        /**
         * @method updateItems
         * @param {Array|String} itemIds
         * @param {Function} callback
         */
        updateItems: function(itemIds, callback) {
            console.log('ok');
            async.waterfall([
                function(callback) {
                    skritter.api.getItems(itemIds, function(items, status) {
                        if (status === 200) {
                            callback(null, items);
                        } else {
                            callback(items);
                        }
                    });
                },
                function(items, callback) {
                    skritter.user.data.insert({Items: items}, function() {
                        skritter.user.scheduler.insert(items);
                        callback();
                    });
                }
            ], function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        }
    });

    return Sync;
});