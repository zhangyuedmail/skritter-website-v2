/**
 * @module Application
 */
define([
    'framework/BaseModel',
    'collections/data/DataDecomps',
    'collections/data/DataItems',
    'collections/data/DataParams',
    'collections/data/DataReviews',
    'collections/data/DataSentences',
    'collections/data/DataSRSConfigs',
    'collections/data/DataStrokes',
    'collections/data/DataVocabs',
    'collections/data/DataVocabLists'
], function(BaseModel, DataDecomps, DataItems, DataParams, DataReviews, DataSentences, DataSRSConfigs, DataStrokes, DataVocabs, DataVocabLists) {
    /**
     * @class UserData
     * @extends BaseModel
     */
    var UserData = BaseModel.extend({
        /**
         * @method initialize
         * @param {User} user
         * @constructor
         */
        initialize: function(attributes, options) {
            this.decomps = new DataDecomps();
            this.items = new DataItems();
            this.params = new DataParams();
            this.reviews = new DataReviews();
            this.sentences = new DataSentences();
            this.srsconfigs = new DataSRSConfigs();
            this.strokes = new DataStrokes();
            this.user = options.user;
            this.vocabs = new DataVocabs();
            this.vocablists = new DataVocabLists();
            this.on('change:access_token', this.updateExpires);
            this.on('change', this.cache);
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            access_token: undefined,
            expires: undefined,
            expires_in: undefined,
            lastErrorCheck: 0,
            lastItemSync: 0,
            lastReviewSync: 0,
            lastSRSConfigSync: 0,
            lastVocabSync: 0,
            refresh_token: undefined,
            token_type: undefined,
            user_id: undefined
        },
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem(this.user.id + '-data', JSON.stringify(this.toJSON()));
        },
        /**
         * @method addItems
         * @param {Object} [options]
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        addItems: function(options, callbackSuccess, callbackError) {
            var self = this;
            options = options ? options : {};
            if (options.showDialog) {
                app.dialogs.show().element('.message-title').text('Searching');
                app.dialogs.element('.message-text').text('');
            }
            async.waterfall([
                function(callback) {
                    app.api.requestBatch([
                        {
                            path: 'api/v' + app.api.get('version') + '/items/add',
                            method: 'POST',
                            params: {
                                lang: app.user.getLanguageCode(),
                                limit: options.limit ? options.limit : 1,
                                offset: 0,
                                fields: 'id'
                            }
                        }
                    ], function(result) {
                        callback(null, result);
                    }, function(error) {
                        callback(error);
                    });
                },
                function(batch, callback) {
                    app.api.checkBatch(batch.id, function() {
                        callback(null, batch);
                    }, function(error) {
                        callback(error);
                    }, function(result) {});
                },
                function(batch, callback) {
                    var totalItems = 0;
                    var totalVocabs = 0;
                    app.api.getBatch(batch.id, function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    }, function(result) {
                        totalItems += result.Items ? result.Items.length : 0;
                        totalVocabs += result.numVocabsAdded ? result.numVocabsAdded : 0;
                        self.vocablists.add(result.VocabLists, {merge: true});
                        console.log('ADDING:', totalVocabs);
                        if (options.showDialog) {
                            app.dialogs.element('.message-title').text('Adding: ' + totalVocabs);
                        }
                    });
                },
                function(callback) {
                    self.sync(function() {
                        callback();
                    }, function() {
                        callback();
                    });
                }
            ], function(error) {
                if (error) {
                    if (options.showDialog) {
                        app.dialogs.hide(function() {
                            callbackError(error);
                        });
                    } else {
                        callbackError(error);
                    }
                } else {
                    if (options.showDialog) {
                        app.dialogs.hide(callbackSuccess);
                    } else {
                        callbackSuccess();
                    }

                }
            });
        },
        /**
         * @method downloadAll
         * @param {Function} callback
         */
        downloadAll: function(callback) {
            var self = this;
            var now = moment().unix();
            app.dialogs.show().element('.message-title').text('Downloading');
            app.dialogs.element('.message-text').text('');
            async.series([
                function(callback) {
                    app.storage.clearAll(callback);
                },
                function(callback) {
                    if (self.has('downloadId')) {
                        callback();
                    } else {
                        app.api.requestBatch([
                            {
                                path: 'api/v' + app.api.get('version') + '/items',
                                method: 'GET',
                                params: {
                                    lang: app.user.getLanguageCode(),
                                    sort: 'changed',
                                    offset: 0,
                                    include_vocabs: 'true',
                                    include_sentences: 'false',
                                    include_strokes: 'true',
                                    include_heisigs: 'true',
                                    include_top_mnemonics: 'true',
                                    include_decomps: 'true'
                                },
                                spawner: true
                            },
                            {
                                path: 'api/v' + app.api.get('version') + '/srsconfigs',
                                method: 'GET',
                                params: {
                                    lang: app.user.getLanguageCode()
                                }
                            },
                            {
                                path: 'api/v' + app.api.get('version') + '/vocablists',
                                method: 'GET',
                                params: {
                                    lang: app.user.getLanguageCode(),
                                    sort: 'studying'
                                }
                            }
                        ], function(result) {
                            self.set('downloadId', result.id);
                            callback();
                        }, function(error) {
                            callback(error);
                        });
                    }
                },
                function(callback) {
                    app.api.checkBatch(self.get('downloadId'), function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    }, function(result) {
                        app.dialogs.show().element('.message-text').text('ASSEMBLING: ' + app.fn.convertBytesToSize(result.responseSize));
                    });
                },
                function(callback) {
                    app.api.getBatch(self.get('downloadId'), function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    }, function(result) {
                        var percent = Math.floor((result.downloadedRequests / result.totalRequests) * 100);
                        app.dialogs.show().element('.message-text').text('FETCHING: ' + percent + '%');
                        self.put(result);
                    });
                }
            ], function(error) {
                if (error) {
                    app.dialogs.element('.message-title').text('Connection interrupted.');
                    app.dialogs.element('.message-text').text('Check your connection and click reload.');
                    app.dialogs.element('.message-other').html(app.fn.bootstrap.button('Reload', {level: 'primary'}));
                    app.dialogs.element('.message-other button').on('vclick', app.reload);
                } else {
                    self.set({
                        lastErrorCheck: now,
                        lastItemSync: now,
                        lastReviewSync: now,
                        lastSRSConfigSync: now,
                        lastVocabSync: now
                    });
                    self.unset('downloadId');
                    app.dialogs.hide(callback);
                }
            });
        },
        /**
         * @method put
         * @param {Object} result
         * @param {Function} [callback]
         */
        put: function(result, callback) {
            async.series([
                function(callback) {
                    app.storage.putItems('decomps', result.Decomps, callback);
                },
                function(callback) {
                    app.storage.putItems('items', result.Items, callback);
                },
                function(callback) {
                    app.storage.putItems('sentences', result.Sentences, callback);
                },
                function(callback) {
                    app.storage.putItems('srsconfigs', result.SRSConfigs, callback);
                },
                function(callback) {
                    app.storage.putItems('strokes', result.Strokes, callback);
                },
                function(callback) {
                    app.storage.putItems('vocablists', result.VocabLists, callback);
                },
                function(callback) {
                    app.storage.putItems('vocabs', result.Vocabs, callback);
                }
            ], function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method sync
         * @param {Function} callbackSuccess
         * @param {Function} [callbackError]
         */
        sync: function(callbackSuccess, callbackError) {
            var self = this;
            var now = moment().unix();
            async.waterfall([
                function(callback) {
                    app.api.requestBatch([
                        {
                            path: 'api/v' + app.api.get('version') + '/items',
                            method: 'GET',
                            params: {
                                lang: app.user.getLanguageCode(),
                                sort: 'changed',
                                offset: self.get('lastItemSync'),
                                include_vocabs: 'true',
                                include_sentences: 'false',
                                include_strokes: 'true',
                                include_heisigs: 'true',
                                include_top_mnemonics: 'true',
                                include_decomps: 'true'
                            },
                            spawner: true
                        }
                    ], function(result) {
                        callback(null, result);
                    }, function(error) {
                        callback(error);
                    });
                },
                function(batch, callback) {
                    app.api.checkBatch(batch.id, function() {
                        callback(null, batch);
                    }, function(error) {
                        callback(error);
                    }, function(result) {});
                },
                function(batch, callback) {
                    app.api.getBatch(batch.id, function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    }, function(result) {
                        console.log('SYNCING:', result.Items ? result.Items.length : 0);
                        self.user.schedule.insert(result.Items);
                        self.put(result);
                    });
                }
            ], function(error) {
                if (error) {
                    if (typeof callbackError === 'function') {
                        callbackError(error);
                    }
                } else {
                    self.set('lastItemSync', now);
                    self.user.schedule.sort();
                    callbackSuccess();
                }
            });
        },
        /**
         * @method updateExpires
         */
        updateExpires: function() {
            this.set('expires', moment().unix() + this.get('expires_in'));
        }
    });

    return UserData;
});