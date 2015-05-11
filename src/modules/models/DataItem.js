/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class DataItem
     * @extends GelatoModel
     */
    var DataItem = GelatoModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.contained = [];
            this.decomps = [];
            this.strokes = [];
            this.vocabs = [];
        },
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @method defaults
         * @returns {Object}
         */
        defaults: function() {
            return {
                vocabIds: []
            };
        },
        /**
         * @method getCharacters
         * @returns {Array}
         */
        getCharacters: function() {
            return this.getVocab().get('writing').split('');
        },
        /**
         * @method getVocab
         * @returns {DataVocab}
         */
        getVocab: function() {
            var vocabs = this.vocabs;
            if (app.user.isChinese()) {
                return vocabs[this.get('reviews') % vocabs.length];
            }
            return vocabs[0];
        },
        /**
         * @method isNew
         * @returns {Boolean}
         */
        isNew: function() {
            return this.get('reviews') ? false : true;
        },
        /**
         * @method isValid
         * @returns {Boolean}
         */
        isValid: function() {
            //filter out any items not loaded yet
            if (this.get('changed') === undefined) {
                return false;
            }
            //filter out items that contain no vocab ids
            if (!this.get('vocabIds').length) {
                return false;
            }
            //filter out items not matching an active part
            if (this.collection.activeParts.indexOf(this.get('part')) === -1) {
                return false;
            }
            //chinese specific filters
            if (this.collection.languageCode === 'zh') {
                //filter out items not matching an active style
                if (this.collection.activeStyles.indexOf(this.get('style')) === -1) {
                    return false;
                }
            }
            //japanese specific filters
            if (this.collection.languageCode === 'ja') {
                //TODO: add japanese specific kana filters
            }
            return true;
        },
        /**
         * @method load
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        load: function(callbackSuccess, callbackError) {
            var self = this;
            var options = {merge: true, silent: true, sort: false};
            var part = this.get('part');
            var userId = app.user.id;
            var vocabIds = this.get('vocabIds');
            //TODO: first check if item is valid
            Async.series([
                //vocabs
                function(callback) {
                    app.user.data.storage.get('vocabs', vocabIds, function(result) {
                        self.vocabs = app.user.data.vocabs.add(result, options);
                        callback();
                    }, function() {
                        callback(new Error('Unable to load vocabs.'));
                    });
                },
                //contained items
                function(callback) {
                    var containedVocabIds = self.getVocab().get('containedVocabIds');
                    if (containedVocabIds && part !== 'defn') {
                        var contained = [];
                        for (var i = 0, length = containedVocabIds.length; i < length; i++) {
                            var splitId = containedVocabIds[i].split('-');
                            var fallbackId = [userId, splitId[0], splitId[1], 0, part].join('-');
                            var intendedId = [userId, containedVocabIds[i], part].join('-');
                            if (self.collection.get(intendedId)) {
                                contained.push(self.collection.get(intendedId));
                            } else if (self.collection.get(fallbackId)) {
                                contained.push(self.collection.get(fallbackId));
                            } else {
                                callback(new Error('Unable to load contained item ids.'));
                                return;
                            }
                        }
                        self.contained = contained;
                        callback();
                    } else {
                        callback();
                    }
                },
                //strokes
                function(callback) {
                    app.user.data.storage.get('strokes', self.getCharacters(), function(result) {
                        self.strokes = app.user.data.strokes.add(result, options);
                        callback();
                    }, function() {
                        callback(new Error('Unable to load strokes.'));
                    });
                },
                //decomps
                function(callback) {
                    app.user.data.storage.get('decomps', self.getCharacters(), function(result) {
                        self.decomps = app.user.data.decomps.add(result, options);
                        callback();
                    }, function() {
                        callback(new Error('Unable to load decomps.'));
                    });
                }
            ], function(error) {
                if (error) {
                    callbackError(error);
                } else {
                    callbackSuccess(self);
                }
            });
        },
        /**
         * @method update
         * @param {PromptResult} result
         * @returns {DataItem}
         */
        update: function(result) {
            this.set('next', 999999999999);
            return this;
        }
    });

    return DataItem;

});