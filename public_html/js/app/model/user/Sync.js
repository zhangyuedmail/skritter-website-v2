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
         * @method processBatch
         * @param {Array} requests
         * @param {Function} callback
         */
        processBatch: function(requests, callback) {
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
                                skritter.user.data.put(result, _.bind(function() {
                                    if (result.Items && result.Items.length > 0) {
                                        skritter.user.scheduler.insert(result.Items);
                                    }
                                    window.setTimeout(request, 2000);
                                }, this));
                            } else {
                                callback(null, batch);
                            }
                        });
                    };
                    request();
                }
            ], callback);
        }
    });

    return Model;
});