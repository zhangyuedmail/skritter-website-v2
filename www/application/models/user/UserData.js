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
            addOffset: 0,
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
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        addItems: function(options, callbackSuccess, callbackError) {
            var self = this;
            var now = moment().unix();
            var items = [];
            var numVocabsAdded = 0;
            var vocablists = [];
            options = options ? options : {};
            options.fetch = options.fetch === undefined ?  true : options.fetch;
            options.limit = options.limit ? options.limit : 1;
            async.series([
                //make initial request for new items
                function (callback) {
                    app.dialogs.element('.message-text').text('CHECKING LISTS');
                    async.waterfall([
                        //request new items via api batch
                        function(callback) {
                            app.api.requestBatch([
                                {
                                    path: 'api/v' + app.api.get('version') + '/items/add',
                                    method: 'POST',
                                    params: {
                                        lang: app.user.getLanguageCode(),
                                        limit: options.limit,
                                        offset: self.get('addOffset')
                                    }
                                }
                            ], function(result) {
                                callback(null, result);
                            }, function(error) {
                                callback(error);
                            });
                        },
                        //check batch until server finish processing
                        function(batch, callback) {
                            app.api.checkBatch(batch.id, function() {
                                callback(null, batch);
                            }, function(error) {
                                callback(error);
                            });
                        },
                        //fetch items that have been added
                        function(batch, callback) {
                            app.api.getBatch(batch.id, function() {
                                callback();
                            }, function(error) {
                                callback(error);
                            }, function(result) {
                                if (result.Items && result.Items.length) {
                                    items = items.concat(result.Items);
                                }
                                if (result.numVocabsAdded) {
                                    numVocabsAdded += result.numVocabsAdded;
                                }
                                if (result.VocabLists && result.VocabLists.length) {
                                    vocablists = vocablists.concat(result.VocabLists);
                                }
                            });
                        },
                    ], callback);
                },
                //sync items changed since items were added
                function(callback) {
                    var resultStarted = 0;
                    var resultFinished = 0;
                    if (options.fetch) {
                        if (items && items.length) {
                            app.dialogs.element('.message-text').text('FETCHING ' + items.length + ' ITEMS');
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
                                                offset: now,
                                                include_vocabs: 'true',
                                                include_sentences: 'false',
                                                include_strokes: 'true',
                                                include_heisigs: 'true',
                                                include_top_mnemonics: 'false',
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
                                        resultStarted++;
                                        if (result.Items && result.Items.length) {
                                            self.user.schedule.insert(result.Items);
                                        }
                                        self.put(result, function() {
                                            resultFinished++;
                                        });
                                    });
                                },
                                //wait for database put operation to finish
                                function(callback) {
                                    (function wait() {
                                        if (resultStarted >= resultFinished) {
                                            callback();
                                        } else {
                                            setTimeout(wait, 1000);
                                        }
                                    })();
                                }
                            ], callback);
                        } else {
                            callback('No items found.');
                        }
                    } else {
                        callback();
                    }
                }
            ], function(error) {
                if (error) {
                    console.log('ITEM ADD ERROR:', error);
                    callbackError(error);
                } else {
                    console.log('ITEMS', items, vocablists, numVocabsAdded);
                    self.set('addOffset', self.get('addOffset') + numVocabsAdded);
                    self.user.data.vocablists.add(vocablists, {merge: true});
                    self.user.schedule.sort();
                    callbackSuccess();
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
                                    include_top_mnemonics: 'false',
                                    include_decomps: 'true'
                                },
                                spawner: true
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
                        if (resultFinished >= resultStarted) {
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
            if (this.attributes.changedVocabIds.indexOf(vocabId) === -1) {
                this.attributes.changedVocabIds.push(vocabId);
            }
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
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        sync: function(callbackSuccess, callbackError) {
            var self = this;
            var now = moment().unix();
            async.series([
                function(callback) {
                    if (self.syncing) {
                        callback('Syncing in progress.');
                    } else {
                        console.log('SYNC:', moment().format('YYYY-MM-DD HH:mm'));
                        self.syncing = true;
                        callback();
                    }
                },
                //REVIEWS
                function(callback) {
                    async.waterfall([
                        //check server for posted review errors
                        function(callback) {
                            app.api.getReviewErrors(self.get('lastErrorCheck'), function(errors) {
                                if (errors && errors.length) {
                                    try {
                                        throw new Error('Review Errors');
                                    } catch (error) {
                                        raygun.send(error, {ReviewErrors: errors});
                                    }
                                    callback(null, errors);
                                } else {
                                    callback(null, []);
                                }
                            }, function(error) {
                                callback(error);
                            });
                        },
                        //fix review error conflicts by downloading fresh item
                        function(errors, callback) {
                            if (errors && errors.length) {
                                var itemIds = _.pluck(errors, 'itemId');
                                app.api.getItemById(itemIds, null, function(result) {
                                    self.user.schedule.insert(result.Items);
                                    self.put(result, function() {
                                        callback();
                                    });
                                }, function() {
                                    callback();
                                });
                            } else {
                                callback();
                            }
                        },
                        //post all reviews to server excluded most recent
                        function(callback) {
                            self.set('lastErrorCheck', now);
                            app.user.reviews.save(function() {
                                callback();
                            }, function(error) {
                                callback(error);
                            });
                        }
                    ], callback);
                },
                //VOCABS
                function(callback) {
                    var changedVocabIds = self.get('changedVocabIds');
                    var resultStarted = 0;
                    var resultFinished = 0;
                    if (changedVocabIds && changedVocabIds.length > 0) {
                        async.waterfall([
                            //fetch locally stored vocabs
                            function(callback) {
                                app.storage.getItems('vocabs', changedVocabIds, function(vocabs) {
                                    callback(null, vocabs);
                                });
                            },
                            //update vocab directly to server
                            function(vocabs, callback) {
                                app.api.updateVocabs(vocabs, function(updated) {
                                    callback(null, _.difference(changedVocabIds, updated));
                                }, function(error) {
                                    callback(error);
                                }, function(result) {
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
                                        self.set('changedVocabIds', changedVocabIds);
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
                //ITEMS
                function(callback) {
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
                                        offset: self.get('lastItemSync')
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
                                resultStarted++;
                                if (result.Items && result.Items.length) {
                                    self.user.schedule.insert(result.Items);
                                }
                                self.put(result, function() {
                                    resultFinished++;
                                });
                            });
                        },
                        //wait for database put operation to finish
                        function(callback) {
                            (function wait() {
                                if (resultFinished >= resultStarted) {
                                    self.set('lastItemSync', now);
                                    callback();
                                } else {
                                    setTimeout(wait, 1000);
                                }
                            })();
                        }
                    ], callback);
                }
            ], function(error) {
                if (error) {
                    console.log('SYNC ERROR:', error);
                    if (typeof callbackError === 'function') {
                        callbackError(error);
                    }
                } else {
                    self.user.schedule.sort();
                    self.syncing = false;
                    if (typeof callbackSuccess === 'function') {
                        callbackSuccess();
                    }
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