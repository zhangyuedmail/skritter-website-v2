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
            window.localStorage.setItem(skritter.user.id + '-sync', JSON.stringify(this.toJSON()));
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
                        include_sentences: 'true',
                        include_heisigs: 'true',
                        include_top_mnemonics: 'true',
                        include_decomps: 'true'
                    },
                    spawner: true
                },
                {
                    path: 'api/v' + skritter.api.version + '/srsconfigs',
                    method: 'GET',
                    params: {lang: languageCode}
                }
            ];
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
                    var downloadedRequests = 0;
                    var responseSize = 0;
                    var totalRequests = 0;
                    var request = function() {
                        skritter.api.getBatch(batch.id, function(result, status) {
                            if (result && status === 200) {
                                downloadedRequests += result.downloadedRequests ? result.downloadedRequests : 0;
                                responseSize += result.responseSize ? result.responseSize : 0;
                                totalRequests = result.totalRequests ? result.totalRequests : totalRequests;
                                if (responseSize > 0) {
                                    skritter.modal.set('.modal-title-right', skritter.fn.convertBytesToSize(responseSize));
                                }
                                if (result.totalRequests > 100) {
                                    skritter.modal.progress(Math.round((downloadedRequests / totalRequests) * 100));
                                }
                                skritter.user.data.put(result, function() {
                                    window.setTimeout(request, 2000);
                                });
                            } else {
                                callback();
                            }
                        });
                    };
                    request();
                }
            ], _.bind(function() {
                this.set({
                    lastErrorCheck: now,
                    lastItemSync: now,
                    lastSRSConfigSync: now,
                    lastVocabSync: now
                });
                if (typeof callback === 'function') {
                    callback();
                }
            }, this));
        },
        /**
         * @method isFirstSync
         * @return {Boolean}
         */
        isFirst: function() {
            return this.get('lastItemSync') === 0 ? true : false;
        }
    });
    
    return Model;
});