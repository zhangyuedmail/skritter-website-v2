/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/data/DataVocab'
], function(BaseCollection, DataVocab) {
    /**
     * @class DataVocabs
     * @extend BaseCollection
     */
    var DataVocabs = BaseCollection.extend({
        /**
         * @method initialize
         * @param {Array} models
         * @param {Object} options
         * @constructor
         */
        initialize: function(models, options) {
            this.data = options.data;
            this.on('change', function(vocab) {
                vocab.cache();
            });
        },
        /**
         * @property model
         * @type DataVocab
         */
        model: DataVocab,
        /**
         * @method cache
         * @param {Function} [callback]
         */
        cache: function(callback) {
            app.storage.putItems('vocabs', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            app.storage.getAll('vocabs', function(data) {
                self.reset();
                self.lazyAdd(data, callback);
            });
        },
        /**
         * @method putChanged
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        putChanged: function(callbackSuccess, callbackError) {
            var self = this;
            var changedVocabIds = self.data.get('changedVocabIds');
            var resultStarted = 0;
            var resultFinished = 0;
            if (changedVocabIds && changedVocabIds.length) {
                async.waterfall([
                    //fetch locally stored vocabs
                    function(callback) {
                        app.storage.getItems('vocabs', changedVocabIds, function(vocabs) {
                            callback(null, vocabs);
                        });
                    },
                    //update vocab directly to server
                    function(vocabs, callback) {
                        app.dialogs.element('.message-text').text('UPDATING VOCABS');
                        app.api.updateVocabs(vocabs, function(updated) {
                            changedVocabIds = _.difference(changedVocabIds, updated);
                            callback();
                        }, function(error) {
                            callback(error);
                        }, function(result) {
                            if (result && result.length) {
                                self.data.user.schedule.insert(result.Items);
                            }
                            resultStarted++;
                            self.data.put(result, function() {
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
                        callbackError();
                    } else {
                        self.data.set('changedVocabIds', changedVocabIds);
                        callbackSuccess();
                    }
                });
            } else {
                callbackSuccess();
            }
        },
        /**
         * @method sync
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        sync: function(callbackSuccess, callbackError) {}
    });

    return DataVocabs;
});
