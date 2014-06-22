define([], function() {
    /**
     * @class UserSync
     */
    var Model = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change', _.bind(this.cache, this));
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            batchId: null,
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
            var now = skritter.fn.getUnixTime();
            async.series([
                function(callback) {
                    skritter.user.data.items.fetch(callback, 0, true);
                },
                function(callback) {
                    skritter.user.data.vocablists.fetch(callback);
                },
                function(callback) {
                    skritter.user.data.srsconfigs.fetch(callback);
                }
            ], function() {
                skritter.user.sync.set({
                    lastErrorCheck: now,
                    lastItemSync: now,
                    lastReviewSync: now,
                    lastSRSConfigSync: now,
                    lastVocabSync: now
                });
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method fetchChanged
         * @param {Function} callback
         */
        fetchChanged: function(callback) {
            var now = skritter.fn.getUnixTime();
            async.series([
                function(callback) {
                    skritter.user.data.items.fetch(callback, skritter.user.sync.get('lastItemSync'), true);
                },
                function(callback) {
                    skritter.user.data.vocablists.fetch(callback);
                },
                function(callback) {
                    skritter.user.data.srsconfigs.fetch(callback);
                }
            ], function() {
                skritter.user.sync.set({
                    lastItemSync: now,
                    lastSRSConfigSync: now,
                    lastVocabSync: now
                });
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method isActive
         * @return {Boolean}
         */
        isActive: function() {
            return false;
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
         */
        processBatch: function(requests, callback) {
            async.waterfall([
                function(callback) {
                    skritter.api.requestBatch(requests, function(batch, status) {
                        if (status === 200) {
                            skritter.user.sync.set('batchId', batch.id);
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
                                skritter.user.data.put(result, function() {
                                    if (result.Items) {
                                        skritter.user.scheduler.insert(result.Items);
                                    }
                                    window.setTimeout(request, 1000);
                                });
                            } else if (status === 200) {
                                callback(null, batch);
                            } else {
                                callback(batch);
                            }
                        });
                    }
                    request();
                }
            ], function() {
                skritter.user.sync.unset('batchId');
                callback();
            });
        }
    });

    return Model;
});