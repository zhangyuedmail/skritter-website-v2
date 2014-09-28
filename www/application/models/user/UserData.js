/**
 * @module Application
 */
define([
    'framework/BaseModel',
    'collections/data/DataDecomps',
    'collections/data/DataItems',
    'collections/data/DataParams',
    'collections/data/DataSentences',
    'collections/data/DataSRSConfigs',
    'collections/data/DataStrokes',
    'collections/data/DataVocabs',
    'collections/data/DataVocabLists'
], function(BaseModel, DataDecomps, DataItems, DataParams, DataSentences, DataSRSConfigs, DataStrokes, DataVocabs, DataVocabLists) {
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
            this.sentences = new DataSentences();
            this.srsconfigs = new DataSRSConfigs();
            this.strokes = new DataStrokes();
            this.syncing = false;
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
            changedVocabIds: [],
            downloadId: undefined,
            expires: undefined,
            expires_in: undefined,
            lastErrorCheck: 0,
            lastItemSync: 0,
            lastReviewSync: 0,
            lastSRSConfigSync: 0,
            lastVocabSync: 0,
            refresh_token: undefined,
            token_type: undefined,
            user_id: undefined,
            userUpdated: false
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
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        addItems: function(options, callbackSuccess, callbackError) {
            var self = this;
            var now = moment().unix();
            options = options ? options : {};
            options.limit = options.limit ? options.limit : 1;
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
                                limit: options.limit,
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
                    if (options.skipSync) {
                        callback();
                    } else {
                        self.sync({includeAll: true, offset: now}, function() {
                            callback();
                        }, function(error) {
                            callback(error);
                        });
                    }
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
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        downloadAll: function(callbackSuccess, callbackError) {
            var self = this;
            var now = moment().unix();
            var resultStarted = 0;
            var resultFinished = 0;
            async.series([
                //clear all locally stored data
                function(callback) {
                    localStorage.removeItem(self.user.id + '-data');
                    localStorage.removeItem(self.user.id + '-history');
                    localStorage.removeItem(self.user.id + '-stats');
                    app.storage.clearAll(callback);
                },
                //send batch request to fetch all data
                function(callback) {
                    if (self.get('downloadId')) {
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
                //check status of download on server
                function(callback) {
                    app.api.checkBatch(self.get('downloadId'), function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    }, function(result) {
                        app.dialogs.element('.message-text').text('ASSEMBLING: ' + app.fn.convertBytesToSize(result.responseSize));
                    });
                },
                //download all item from server in chunks
                function(callback) {
                    app.api.getBatch(self.get('downloadId'), function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    }, function(result) {
                        var percent = Math.floor((result.downloadedRequests / result.totalRequests) * 100);
                        app.dialogs.element('.message-text').text('FETCHING: ' + percent + '%');
                        resultStarted++;
                        self.put(result, function() {
                            resultFinished++;
                        });
                    });
                },
                //wait for database put operation to finish
                function(callback) {
                    (function wait() {
                        if (resultStarted === resultFinished) {
                            callback();
                        } else {
                            setTimeout(wait, 1000);
                        }
                    })();
                }
            ], function(error) {
                if (error) {
                    callbackError(error);
                } else {
                    self.set({
                        downloadId: undefined,
                        lastErrorCheck: now,
                        lastItemSync: now,
                        lastReviewSync: now,
                        lastSRSConfigSync: now,
                        lastVocabSync: now
                    });
                    callbackSuccess();
                }
            });
        },
        /**
         * @method flagVocabUpdate
         * @param {String} vocabId
         */
        flagVocabUpdate: function(vocabId) {
            console.log('flagging vocab', vocabId);
            this.attributes.changedVocabIds.push(vocabId);
            this.cache();
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
         * @param {Object} [options]
         * @param {Function} callbackSuccess
         * @param {Function} [callbackError]
         */
        sync: function(options, callbackSuccess, callbackError) {
            var self = this;
            var now = moment().unix();
            options = options ? options : {};
            options.includeAll = options.includeAll ? options.includeAll : false;
            async.series([
                function(callback) {
                    if (self.syncing) {
                        callback('Sync in progress.');
                    } else {
                        self.syncing = true;
                        self.trigger('sync', self.syncing);
                        callback();
                    }
                },
                //check server for posted review errors
                function(callback) {
                    app.api.getReviewErrors(self.get('lastErrorCheck'), function(errors) {
                        if (errors.length) {
                            try {
                                throw new Error('Review Errors');
                            } catch (error) {
                                raygun.send(error, {ReviewErrors: errors});
                            }
                        }
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                },
                //post review to server first
                function(callback) {
                    app.user.reviews.save(function() {
                        callback();
                    }, function() {
                        callback();
                    });
                },
                //sync locally changed vocabs
                function(callback) {
                    if (self.get('changedVocabIds').length) {
                        var resultStarted = 0;
                        var resultFinished = 0;
                        async.waterfall([
                            //fetch locally stored vocabs
                            function(callback) {
                                app.storage.getItems('vocabs', self.get('changedVocabIds'), function(vocabs) {
                                    callback(null, vocabs);
                                });
                            },
                            //update vocab directly to server
                            function(vocabs, callback) {
                                app.api.updateVocabs(vocabs, function(updated) {
                                    callback(null, _.difference(self.get('changedVocabIds'), updated));
                                }, function(error) {
                                    callback(error);
                                }, function(result) {
                                    console.log('VOCAB RESULTS:', result);
                                    resultStarted++;
                                    self.user.schedule.insert(result.Items);
                                    self.put(result, function() {
                                        resultFinished++;
                                    });
                                });
                            },
                            //wait for database put operation to finish
                            function(changedVocabIds, callback) {
                                (function wait() {
                                    if (resultStarted === resultFinished) {
                                        self.set('changedVocabIds', changedVocabIds, {silent: true});
                                        callback();
                                    } else {
                                        setTimeout(wait, 1000);
                                    }
                                })();
                            }
                        ], callback);
                    } else {
                        callback();
                    }
                },
                //sync items changed from last
                function(callback) {
                    if (self.get('lastItemSync') < moment(now * 1000).subtract('500', 'minutes').unix()) {
                        var resultStarted = 0;
                        var resultFinished = 0;
                        async.waterfall([
                            //batch request to fetch all changed items
                            function(callback) {
                                app.api.requestBatch([
                                    {
                                        path: 'api/v' + app.api.get('version') + '/items',
                                        method: 'GET',
                                        params: {
                                            lang: app.user.getLanguageCode(),
                                            sort: 'changed',
                                            offset: options.offset || self.get('lastItemSync'),
                                            include_vocabs: (options.includeVocabs || options.includeAll).toString(),
                                            include_sentences: 'false',
                                            include_strokes: (options.includeStrokes || options.includeAll).toString(),
                                            include_heisigs: (options.includeHeisigs || options.includeAll).toString(),
                                            include_top_mnemonics: (options.includeTopMnemonics || options.includeAll).toString(),
                                            include_decomps: (options.includeDecomps || options.includeAll).toString()
                                        },
                                        spawner: true
                                    }
                                ], function(result) {
                                    callback(null, result);
                                }, function(error) {
                                    callback(error);
                                });
                            },
                            //wait for the batch request to finish
                            function(batch, callback) {
                                app.api.checkBatch(batch.id, function() {
                                    callback(null, batch);
                                }, function(error) {
                                    callback(error);
                                }, function(result) {});
                            },
                            //download back in controlled chunks
                            function(batch, callback) {
                                app.api.getBatch(batch.id, function() {
                                    callback();
                                }, function(error) {
                                    callback(error);
                                }, function(result) {
                                    console.log('SYNC/DOWN:', result.Items ? result.Items.length : 0);
                                    resultStarted++;
                                    self.user.schedule.insert(result.Items);
                                    self.put(result, function() {
                                        resultFinished++;
                                    });
                                });
                            },
                            //wait for database put operation to finish
                            function(callback) {
                                (function wait() {
                                    if (resultStarted === resultFinished) {
                                        self.set('lastItemSync', now, {silent: true});
                                        callback();
                                    } else {
                                        setTimeout(wait, 1000);
                                    }
                                })();
                            }
                        ], callback);
                    } else {
                        callback();
                    }
                }
            ], function(error) {
                self.syncing = false;
                self.trigger('sync', self.syncing);
                if (error) {
                    if (typeof callbackError === 'function') {
                        callbackError(error);
                    }
                } else {
                    self.cache();
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