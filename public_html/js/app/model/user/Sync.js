define([], function() {
    /**
     * @class UserSync
     */
    var Model = Backbone.Model.extend({
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
            batchId: null,
            batchRequestIds: [],
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
         * @method fetchAll
         * @param {Function} callback
         */
        fetchAll: function(callback) {
            if (this.syncing) {
                if (typeof callback === 'function') {
                    callback();
                }
            } else {
                this.syncing = true;
                this.trigger('status', true);
                var now = skritter.fn.getUnixTime();
                async.series([
                    function(callback) {
                        skritter.user.data.items.fetch(callback, 0, true, true);
                    },
                    function(callback) {
                        skritter.user.data.vocablists.fetch(callback);
                    },
                    function(callback) {
                        if (skritter.user.data.vocablists.getActiveCount() === 0) {
                            var chinese101 = 'agtzfndyaXRlLXdheXIWCxINVm9jYWJMaXN0SW5mbxjfn_lNDA';
                            var japanese101 = '198299172';
                            var defaultListId = skritter.user.isChinese() ? chinese101 : japanese101;
                            skritter.user.data.vocablists.fetchById(defaultListId, 'adding', callback);
                        } else {
                            callback();
                        }
                    },
                    function(callback) {
                        if (skritter.user.scheduler.data.length === 0) {
                            skritter.user.data.items.addItems(callback, 5);
                        } else {
                            callback();
                        }
                    },
                    function(callback) {
                        skritter.user.data.srsconfigs.fetch(callback);
                    },
                    function(callback) {
                        skritter.user.scheduler.clear().loadAll(callback);
                    }
                ], _.bind(function() {
                    skritter.user.sync.set({
                        lastErrorCheck: now,
                        lastItemSync: now,
                        lastReviewSync: now,
                        lastSRSConfigSync: now,
                        lastVocabSync: now
                    });
                    skritter.user.scheduler.sort();
                    this.syncing = false;
                    this.trigger('status', false);
                    if (typeof callback === 'function') {
                        callback();
                    }
                }, this));
            }
        },
        /**
         * @method fetchChanged
         * @param {Function} callback
         */
        fetchChanged: function(callback) {
            if (this.syncing) {
                if (typeof callback === 'function') {
                    callback();
                }
            } else {
                this.syncing = true;
                this.trigger('status', true);
                var now = skritter.fn.getUnixTime();
                async.series([
                    function(callback) {
                        skritter.user.data.reviews.save(callback, true);
                    },
                    function(callback) {
                        skritter.user.data.items.fetch(callback, skritter.user.sync.get('lastItemSync'), true, false);
                    },
                    function(callback) {
                        skritter.user.data.vocablists.fetch(callback);
                    },
                    function(callback) {
                        skritter.user.data.srsconfigs.fetch(callback);
                    }
                ], _.bind(function() {
                    skritter.user.sync.set({
                        lastItemSync: now,
                        lastSRSConfigSync: now,
                        lastVocabSync: now
                    });
                    skritter.user.scheduler.sort();
                    this.syncing = false;
                    this.trigger('status', false);
                    if (typeof callback === 'function') {
                        callback();
                    }
                }, this));
            }
        },
        /**
         * @method isActive
         * @return {Boolean}
         */
        isActive: function() {
            return this.syncing;
        },
        /**
         * @method isInitial
         * @return {Boolean}
         */
        isInitial: function() {
            return this.get('lastItemSync') === 0 ? true : false;
        },
        /**
         * @method processBatch
         * @param {Array} requests
         * @param {Function} callback
         * @param {Boolean} skipScheduler
         */
        processBatch: function(requests, callback, skipScheduler) {
            var retryCount = 0;
            async.waterfall([
                function(callback) {
                    function request() {
                        skritter.api.requestBatch(requests, function(batch, status) {
                            if (status === 200) {
                                skritter.user.sync.set('batchId', batch.id);
                                callback(null, batch);
                            } else if (status === 0) {
                                if (retryCount < 5) {
                                    retryCount++;
                                    window.setTimeout(request, 2000);
                                } else {
                                    callback(batch);
                                }
                            } else {
                                callback(batch);
                            }
                        });

                    }
                    request();
                },
                function(batch, callback) {
                    var batchRequestIds = [];
                    var retryCount = 0;
                    var totalResponseSize = 0;
                    function request() {
                        skritter.api.getBatch(batch.id, function(result, status) {
                            if (result && status === 200) {
                                batchRequestIds = batchRequestIds.concat(result.requestIds);
                                totalResponseSize += result.responseSize;
                                skritter.user.data.put(result, function() {
                                    if (totalResponseSize > 1024) {
                                        skritter.modal.set('.modal-sub-title', skritter.fn.convertBytesToSize(totalResponseSize));
                                    }
                                    if (!skipScheduler && result.Items) {
                                        skritter.user.scheduler.insert(result.Items);
                                    }
                                    skritter.user.sync.set('batchRequestIds', batchRequestIds);
                                    window.setTimeout(request, 500);
                                });
                            } else if (status === 200) {
                                callback(null, batch);
                            } else if (status === 0) {
                                if (retryCount < 5) {
                                    retryCount++;
                                    window.setTimeout(request, 2000);
                                } else {
                                    callback(batch);
                                }
                            } else {
                                callback(batch);
                            }
                        });
                    }
                    request();
                }
            ], function() {
                skritter.user.sync.unset('batchId');
                skritter.user.sync.unset('batchRequestIds');
                callback();
            });
        }
    });

    return Model;
});