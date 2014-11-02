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
            this.backgroundSync = undefined;
            this.decomps = new DataDecomps();
            this.items = new DataItems(null, {data: this});
            this.params = new DataParams();
            this.sentences = new DataSentences();
            this.srsconfigs = new DataSRSConfigs();
            this.strokes = new DataStrokes();
            this.syncing = false;
            this.user = options.user;
            this.vocabs = new DataVocabs(null, {data: this});
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
            addHistory: undefined,
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
         * @method incrementAddedItems
         * @param {Number} addedCount
         * @returns {UserData}
         */
        incrementAddedItems: function(addedCount) {
            var today = moment().format('YYYY-MM-DD');
            var history = this.get('addHistory');
            if (this.get('addHistory') && today === history.date) {
                this.set('addHistory', {date: today, added: history.added + addedCount});
            } else {
                this.set('addHistory', {date: today, added: addedCount});
            }
            return this;
        },
        /**
         * @method loadAll
         * @param {Function} [callback]
         */
        loadAll: function(callback) {
            var result = {};
            async.parallel([
                function(callback) {
                    app.storage.getAll('decomps', function(data) {
                        result.Decomps = data;
                        callback();
                    });
                },
                function(callback) {
                    app.storage.getAll('items', function(data) {
                        result.Items = data;
                        callback();
                    });
                },
                function(callback) {
                    app.storage.getAll('sentences', function(data) {
                        result.Sentences = data;
                        callback();
                    });
                },
                function(callback) {
                    app.storage.getAll('srsconfigs', function(data) {
                        result.SRSConfigs = data;
                        callback();
                    });
                },
                function(callback) {
                    app.storage.getAll('strokes', function(data) {
                        result.Strokes = data;
                        callback();
                    });
                },
                function(callback) {
                    app.storage.getAll('vocablists', function(data) {
                        result.VocabLists = data;
                        callback();
                    });
                },
                function(callback) {
                    app.storage.getAll('vocabs', function(data) {
                        result.Vocabs = data;
                        callback();
                    });
                }
            ], function() {
                if (typeof callback === 'function') {
                    callback(result);
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
         * @method startBackgroundSync
         */
        startBackgroundSync: function() {
            var self = this;
            this.backgroundSync = setInterval(function() {
                self.sync(1);
            }, moment.duration(5, 'minutes').asMilliseconds());
        },
        /**
         * @method stopBackgroundSync
         */
        stopBackgroundSync: function() {
            clearInterval(this.backgroundSync);
            this.backgroundSync = undefined;
        },
        /**
         * @method sync
         * @param {Number} startFrom
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        sync: function(startFrom, callbackSuccess, callbackError) {
            var self = this;
            if (this.syncing) {
                if (typeof callbackError === 'function') {
                    callbackError('Sync already in progress.');
                }
            } else {
                this.syncing = true;
                this.trigger('sync', true);
                console.log('^^^SYNC STARTED:', moment().format('HH:mm:ss YYYY-MM-DD'));
                async.series([
                    function(callback) {
                        app.dialogs.element('.message-text').text('CALCULATING STATS');
                        self.user.stats.sync(callback, callback);
                    },
                    function(callback) {
                        if (self.get('changedVocabIds').length) {
                            app.dialogs.element('.message-text').text('SAVING VOCABS');
                            self.vocabs.putChanged(callback, callback);
                        } else {
                            callback();
                        }
                    },
                    function(callback) {
                        if (self.user.reviews.length > startFrom) {
                            app.dialogs.element('.message-text').text('POSTING REVIEWS');
                            self.user.reviews.post(startFrom, callback, callback);
                        } else {
                            callback();
                        }
                    }
                ], function(error) {
                    self.syncing = false;
                    self.trigger('sync', false);
                    if (error) {
                        if (error.status === 403) {
                            self.stopBackgroundSync();
                        } else {
                            console.log('^^^SYNC ERROR', error);
                        }
                        if (typeof callbackError === 'function') {
                            callbackError();
                        }
                    } else {
                        app.analytics.trackUserEvent('background sync');
                        console.log('^^^SYNC FINISHED:', moment().format('HH:mm:ss YYYY-MM-DD'));
                        if (typeof callbackSuccess === 'function') {
                            callbackSuccess();
                        }
                    }
                });
            }
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