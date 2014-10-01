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
                self.sync();
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
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        sync: function(callbackSuccess, callbackError) {
            var self = this;
            async.series([
                function(callback) {
                    if (self.syncing) {
                        callback('Sync already in progress.');
                    } else {
                        this.syncing = true;
                        callback();
                    }
                },
                function(callback) {
                    self.vocabs.putChanged(callback, callback);
                },
                function(callback) {
                    self.user.stats.sync(callback, callback);
                },
                function(callback) {
                    self.user.reviews.checkErrors(callback, callback);
                },
                function(callback) {
                    self.user.reviews.post(callback, callback);
                }
            ], function(error) {
                if (error) {
                    console.log('SYNC ERROR', error);
                    if (typeof callbackError === 'function') {
                        callbackError();
                    }
                } else {
                    self.syncing = false;
                    console.log('SYNC:', moment().format('HH:mm/YYYY-MM-DD'));
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