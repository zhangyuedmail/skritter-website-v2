define([], function() {
    /**
     * @class UserSync
     */
    var Model = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.active = {
                addItems: false,
                changedItems: false,
                downloadAll: false,
                itemById: false,
                reviews: false,
                vocabById: false
            };
            this.on('change', _.bind(this.cache, this));
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            addItemOffset: 0,
            downloadBatchId: null,
            downloadedBatchRequests: [],
            lastErrorCheck: 0,
            lastItemSync: 0,
            lastReviewSync: 0,
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
            var now = skritter.fn.getUnixTime();
            var offset = this.get('addItemOffset');
            var requests = {
                path: 'api/v' + skritter.api.version + '/items/add',
                method: 'POST',
                params: {
                    lang: skritter.user.getLanguageCode(),
                    limit: limit,
                    offset: offset,
                    fields: 'id'
                }
            };
            this.active.addItems = true;
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
                    var itemIds = [];
                    var request = function() {
                        skritter.api.getBatch(batch.id, function(result, status) {
                            if (result && status === 200) {
                                if (result.Items) {
                                    itemIds = itemIds.concat(_.pluck(result.Items, 'id'));
                                }
                                window.setTimeout(request, 500);
                            } else {
                                callback(null, itemIds);
                            }
                        });
                    };
                    request();
                },
                function(itemIds, callback) {
                    console.log('added items', itemIds);
                    skritter.user.sync.changedItems(function() {
                        callback(null, itemIds);
                    }, now, true);
                }
            ], _.bind(function(error, itemIds) {
                skritter.user.scheduler.sort();
                this.active.addItems = false;
                if (typeof callback === 'function') {
                    callback(itemIds);
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
            offset = offset ? offset : this.get('lastItemSync');
            var languageCode = skritter.user.getLanguageCode();
            var now = skritter.fn.getUnixTime();
            var requests = [
                {
                    path: 'api/v' + skritter.api.version + '/items',
                    method: 'GET',
                    params: {
                        lang: languageCode,
                        sort: 'changed',
                        offset: offset,
                        include_vocabs: includeResources ? 'true' : 'false',
                        include_strokes: includeResources ? 'true' : 'false',
                        include_sentences: 'false',
                        include_heisigs: includeResources ? 'true' : 'false',
                        include_top_mnemonics: includeResources ? 'true' : 'false',
                        include_decomps: includeResources ? 'true' : 'false'
                    },
                    spawner: true
                }
            ];
            this.active.changedItems = true;
            async.series([
                async.apply(this.processBatch, requests)
            ], _.bind(function() {
                this.set({
                    lastItemSync: now
                });
                this.active.changedItems = false;
                if (typeof callback === 'function') {
                    callback();
                }
            }, this));
        },
        /**
         * @method downloadAll
         * @param {Function} callback
         */
        downloadAll: function(callback) {
            var now = skritter.fn.getUnixTime();
            var languageCode = skritter.user.getLanguageCode();
            var requests = [
                {
                    path: 'api/v' + skritter.api.version + '/items',
                    method: 'GET',
                    params: {
                        lang: languageCode,
                        sort: 'changed',
                        offset: 0,
                        include_vocabs: 'true',
                        include_strokes: 'true',
                        include_sentences: 'false',
                        include_heisigs: 'true',
                        include_top_mnemonics: 'true',
                        include_decomps: 'true'
                    },
                    spawner: true
                },
                {
                    path: 'api/v' + skritter.api.version + '/vocablists',
                    method: 'GET',
                    params: {
                        lang: languageCode,
                        sort: 'studying'
                    }
                },
                {
                    path: 'api/v' + skritter.api.version + '/srsconfigs',
                    method: 'GET',
                    params: {lang: languageCode}
                }
            ];
            this.active.downloadAll = true;
            async.series([
                async.apply(this.processBatch, requests)
            ], _.bind(function() {
                this.set({
                    lastErrorCheck: now,
                    lastItemSync: now,
                    lastSRSConfigSync: now,
                    lastVocabSync: now
                });
                this.active.downloadAll = false;
                if (typeof callback === 'function') {
                    callback();
                }
            }, this));
        },
        /**
         * @method isActive
         * @return {Boolean}
         */
        isActive: function() {
            for (var prop in this.active) {
                if (this.active[prop]) {
                    return true;
                }
            }
            return false;
        },
        /**
         * @method isFirstSync
         * @return {Boolean}
         */
        isFirst: function() {
            return this.get('lastItemSync') === 0 ? true : false;
        },
        /**
         * @method itemById
         * @param {Array|String} itemIds
         * @param {type} callback
         * @param {Object} options
         */
        itemById: function(itemIds, callback, options) {
            this.active.itemById = true;
            async.waterfall([
                function(callback) {
                    skritter.api.getItems(itemIds, function(items, status) {
                        if (status === 200) {
                            callback(null, items);
                        } else {
                            callback(items);
                        }
                    }, options);
                },
                function(items, callback) {
                    skritter.user.data.put(items, callback);
                }
            ], _.bind(function() {
                this.active.itemById = false;
                if (typeof callback === 'function') {
                    callback();
                }
            }, this));
        },
        /**
         * @method processBatch
         * @param {Array} requests
         * @param {Function} callback
         */
        processBatch: function(requests, callback) {
            var downloadedRequests = 0;
            var requestIds = [];
            var responseSize = 0;
            var totalRequests = 0;
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
                    var request = function() {
                        skritter.api.getBatch(batch.id, function(result, status) {
                            if (result && status === 200) {
                                downloadedRequests += result.downloadedRequests ? result.downloadedRequests : 0;
                                responseSize += result.responseSize ? result.responseSize : 0;
                                totalRequests = result.totalRequests ? result.totalRequests : totalRequests;
                                if (responseSize > 0) {
                                    skritter.modal.set('.modal-progress-value', skritter.fn.convertBytesToSize(responseSize));
                                }
                                if (result.totalRequests > 100) {
                                    skritter.modal.progress(Math.round((downloadedRequests / totalRequests) * 100));
                                }
                                skritter.user.data.put(result, _.bind(function() {
                                    if (result.Items && result.Items.length > 0) {
                                        skritter.user.scheduler.insert(result.Items);
                                    }
                                    requestIds = requestIds.concat(_.without(result.requestIds, undefined));
                                    window.setTimeout(request, 2000);
                                }, this));
                            } else {
                                callback(null, batch, requestIds);
                            }
                        });
                    };
                    request();
                },
                function(batch, requestIds, callback) {
                    skritter.api.checkBatch(batch.id, function(batch, status) {
                        if (status === 200) {
                            var batchRequestIds = _.pluck(batch.Requests, 'id');
                            var missingRequestIds = _.difference(requestIds, batchRequestIds);
                            if (missingRequestIds && missingRequestIds.length > 0) {
                                callback();
                            } else {
                                callback();
                            }
                        } else {
                            callback(batch);
                        }
                    });
                }
            ], callback);
        },
        /**
         * @method reviews
         * @param {Function} callback
         */
        reviews: function(callback) {
            var now = skritter.fn.getUnixTime();
            var lastErrorCheck = this.get('lastErrorCheck');
            var reviews = skritter.user.data.reviews.getReviewArray();
            this.active.reviews = true;
            async.waterfall([
                function(callback) {
                    skritter.api.checkReviewErrors(lastErrorCheck, function(reviewErrors, status) {
                        if (status === 200 && reviewErrors.length === 0) {
                            callback();
                        } else if (status === 200) {
                            if (window.Raygun) {
                                try {
                                    throw new Error('Review Error');
                                } catch (error) {
                                    console.error('Review Error', reviewErrors);
                                    Raygun.send(error, {
                                        reviewErrors: reviewErrors
                                    });
                                }
                            }
                            skritter.user.sync.itemById(_.uniq(_.pluck(reviewErrors, 'itemId')), callback);
                        } else {
                            callback(reviewErrors);
                        }
                    });
                },
                function(callback) {
                    if (reviews.length > 0) {
                        console.log('posting reviews', reviews);
                        skritter.api.postReviews(reviews, function(postedReviews, status) {
                            if (status === 200) {
                                callback(null, postedReviews);
                            } else if (status === 403) {
                                callback(postedReviews);
                            } else {
                                if (window.Raygun) {
                                    try {
                                        throw new Error('Review Format Error');
                                    } catch (error) {
                                        console.error('Review Format Error', postedReviews);
                                        Raygun.send(error);
                                    }
                                }
                                callback(postedReviews);
                            }
                        });
                    } else {
                        callback(null, []);
                    }
                },
                function(postedReviews, callback) {
                    var reviewIds = _.uniq(_.pluck(postedReviews, 'wordGroup'));
                    if (reviewIds.length > 0) {
                        skritter.storage.remove('reviews', reviewIds, function() {
                            skritter.user.data.reviews.remove(reviewIds);
                            callback();
                        });
                    } else {
                        callback();
                    }
                }
            ], _.bind(function() {
                this.set({
                    lastErrorCheck: now,
                    lastReviewSync: now
                });
                this.active.reviews = false;
                if (typeof callback === 'function') {
                    callback();
                }
            }, this));
        },
        /**
         * @method vocabById
         * @param {Array|String} vocabIds
         * @param {type} callback
         * @param {Object} options
         */
        vocabById: function(vocabIds, callback, options) {
            this.active.vocabById = true;
            async.waterfall([
                function(callback) {
                    skritter.api.getVocabs(vocabIds, function(vocabs, status) {
                        if (status === 200) {
                            callback(null, vocabs);
                        } else {
                            callback(vocabs);
                        }
                    }, options);
                },
                function(vocabs, callback) {
                    skritter.user.data.put(vocabs, callback);
                }
            ], _.bind(function() {
                this.active.vocabById = false;
                if (typeof callback === 'function') {
                    callback();
                }
            }, this));
        }
    });

    return Model;
});