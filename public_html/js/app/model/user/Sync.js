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
            var offset = this.get('addItemOffset');
            var requests = {
                path: 'api/v' + skritter.api.get('version') + '/items/add',
                method: 'POST',
                params: {
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
                                console.log('ADDED ITEMS', result.Items);
                                window.setTimeout(request, 2000);
                            } else if (result) {
                                //TODO: handle errors and other incorrect status codes
                            } else {
                                callback();
                            }
                        });
                    }
                    request();
                },
                function(callback) {
                    function sync() {
                        if (self.syncing) {
                            window.setTimeout(sync, 2000);
                        } else {
                            self.changedItems(callback);
                        }
                    }
                    sync();
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
         * @param {Boolean} downloadAll
         */
        changedItems: function(callback, downloadAll) {
            var self = this;
            if (self.syncing) {
                if (typeof callback === 'function')
                    callback();
                return;
            }
            var requests = [];
            var downloadedRequests = 0;
            var responseSize = 0;
            var lastItemSync = downloadAll ? 0 : this.get('lastItemSync');
            var lastSRSConfigSync = downloadAll ? 0 : this.get('lastSRSConfigSync');
            var lastVocabSync = downloadAll ? 0 : this.get('lastVocabSync');
            var updatedSRSConfigs = false;
            var updatedVocabs = false;
            var now = skritter.fn.getUnixTime();
            self.syncing = true;
            self.trigger('sync', self.syncing, true);
            console.log('SYNCING FROM', (lastItemSync === 0) ? 'THE BEGINNING OF TIME' : moment(lastItemSync * 1000).format('YYYY-MM-DD H:mm:ss'));
            if (lastItemSync === 0 || downloadAll) {
                skritter.modal.show('download')
                        .set('.modal-title', 'DOWNLOADING ACCOUNT')
                        .progress(100);
                requests.push({
                    path: 'api/v' + skritter.api.get('version') + '/vocablists',
                    method: 'GET',
                    params: {
                        sort: 'custom'
                    },
                    spawner: true
                });
                requests.push({
                    path: 'api/v' + skritter.api.get('version') + '/vocablists',
                    method: 'GET',
                    params: {
                        sort: 'studying'
                    },
                    spawner: true
                });
            }
            requests.push({
                path: 'api/v' + skritter.api.get('version') + '/items',
                method: 'GET',
                params: {
                    sort: 'changed',
                    offset: lastItemSync,
                    include_vocabs: 'true',
                    include_strokes: 'true',
                    include_sentences: 'true',
                    include_heisigs: 'true',
                    include_top_mnemonics: 'true',
                    include_decomps: 'true'
                },
                spawner: true
            });
            if (lastVocabSync !== 0 && moment(lastVocabSync * 1000).add('hours', 12).valueOf() / 1000 <= now) {
                requests.push({
                    path: 'api/v' + skritter.api.get('version') + '/vocabs',
                    method: 'GET',
                    params: {
                        sort: 'all',
                        offset: lastVocabSync,
                        include_strokes: 'true',
                        include_sentences: 'true',
                        include_heisigs: 'true',
                        include_top_mnemonics: 'true',
                        include_decomps: 'true'
                    },
                    spawner: true
                });
                updatedVocabs = true;
            }
            if (lastSRSConfigSync === 0 || moment(lastSRSConfigSync * 1000).add('hours', 2).valueOf() / 1000 <= now) {
                requests.push({
                    path: 'api/v' + skritter.api.get('version') + '/srsconfigs',
                    method: 'GET'
                });
                updatedSRSConfigs = true;
            }
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
                                if (lastItemSync !== 0 && result.Items)
                                    skritter.user.scheduler.insert(result.Items);
                                skritter.user.data.insert(result, function() {
                                    window.setTimeout(request, 2000);
                                });
                            } else if (result) {
                                //TODO: handle errors and other incorrect status codes
                            } else {
                                callback();
                            }
                        });
                    }
                    request();
                }
            ], function() {
                console.log('FINISHED SYNCING AT', moment(now * 1000).format('YYYY-MM-DD H:mm:ss'));
                self.set('lastItemSync', now);
                if (updatedSRSConfigs)
                    self.set('lastSRSConfigSync', now);
                if (updatedVocabs)
                    self.set('lastVocabSync', now);
                self.syncing = false;
                self.trigger('sync', self.syncing, false);
                skritter.modal.hide();
                if (typeof callback === 'function')
                    callback();
            });
        }
    });

    return Sync;
});