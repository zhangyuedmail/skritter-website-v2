/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoCollection',
    'modules/models/DataItem'
], function(GelatoCollection, DataItem) {

    /**
     * @class DataItems
     * @extends GelatoCollection
     */
    var DataItems = GelatoCollection.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property model
         * @type DataItem
         */
        model: DataItem,
        /**
         * @method fetchNext
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        fetchChanged: function(callbackSuccess, callbackError) {
            var self = this;
            (function next(cursor) {
                app.api.fetchItems({
                    cursor: cursor,
                    offset: app.user.data.get('lastItemUpdate'),
                    sort: 'changed',
                    include_contained: true,
                    include_decomps: true,
                    include_strokes: true,
                    include_vocabs: true
                }, function(result) {
                    console.log('RESULT', result);
                    app.user.data.insert(result, function() {
                        if (result.cursor) {
                            self.add(result.Items, {merge: true});
                            next(result.cursor);
                        } else {
                            app.user.data.set('lastItemUpdate', Moment().unix());
                            callbackSuccess();
                        }
                    }, function(error) {
                        callbackError(error);
                    });
                }, function(error) {
                    callbackError(error);
                });
            })();
        },
        /**
         * @method fetchNext
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        fetchIds: function(callbackSuccess, callbackError) {
            var self = this;
            app.api.fetchItemIds({
                lang: app.user.getLanguageCode()
            }, function(result) {
                app.user.data.insert(result, function() {
                    self.add(result, {merge: true});
                    callbackSuccess();
                }, function(error) {
                    callbackError(error);
                });
            }, function(error) {
                callbackError(error);
            });
        },
        /**
         * @method fetchMissing
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         * @param {Function} [callbackStatus]
         */
        fetchMissing: function(callbackSuccess, callbackError, callbackStatus) {
            var self = this;
            var missingIds = this.getMissingIds();
            var missingTotal = missingIds.length;
            if (missingIds.length) {
                (function next() {
                    app.api.fetchItems({
                        ids: missingIds.slice(0,29).join('|'),
                        include_contained: true,
                        include_decomps: true,
                        include_strokes: true,
                        include_vocabs: true
                    }, function(result) {
                        app.user.data.insert(result, function() {
                            self.add(result.Items, {merge: true});
                            if (missingIds.length) {
                                missingIds = self.getMissingIds();
                                if (typeof callbackStatus === 'function') {
                                    var completion = 1 - (missingIds.length / missingTotal);
                                    callbackStatus(Math.floor(completion * 100));
                                }
                                next();
                            } else {
                                callbackSuccess();
                            }
                        }, function(error) {
                            callbackError(error);
                        });
                    }, function(error) {
                        callbackError(error);
                    });
                }());
            } else {
                callbackSuccess();
            }
        },
        /**
         * @method fetchNext
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        fetchNext: function(callbackSuccess, callbackError) {
            var self = this;
            app.api.fetchItems({
                sort: 'next',
                include_contained: true,
                include_decomps: true,
                include_strokes: true,
                include_vocabs: true
            }, function(result) {
                app.user.data.insert(result, function() {
                    callbackSuccess(self.add(result.Items, {merge: true}));
                }, function(error) {
                    callbackError(error);
                });
            }, function(error) {
                callbackError(error);
            });
        },
        /**
         * @method getItemAddedCount
         * @returns {Number}
         */
        getAddedCount: function() {
            var today = Moment().startOf('day').add(3, 'hours').unix();
            return _.filter(this.models, function(item) {
                return item.get('created') >= today;
            }).length;
        },
        /**
         * @method getDue
         * @returns {Number}
         */
        getDue: function() {
            var now = Moment().unix();
            return _.filter(this.filtered, function(item) {
                return item.get('next') > now;
            });
        },
        /**
         * @method getDueCount
         */
        getDueCount: function() {
            return this.getDue().length;
        },
        /**
         * @method getMissingIds
         * @returns {Array}
         */
        getMissingIds: function() {
            return _.map(_.filter(this.models, function(item) {
                return !item.has('next');
            }), function(item) {
                return item.id;
            });
        },
        /**
         * @method getItemReviewedCount
         * @returns {Number}
         */
        getReviewedCount: function() {
            var today = Moment().startOf('day').add(3, 'hours').unix();
            return _.filter(this.models, function(item) {
                return item.attributes.last >= today;
            }).length;
        },
        /**
         * @method hasVocabId
         * @param {String} vocabId
         * @returns {Boolean}
         */
        hasVocabId: function(vocabId) {
            return _.filter(this.models, function(item) {
                return item.id.indexOf(vocabId) > -1;
            }).length ? true : false;
        },
        /**
         * @method load
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        load: function(callbackSuccess, callbackError) {
            var self = this;
            app.user.data.storage.all('items', function(result) {
                self.lazyAdd(result, function() {
                    if (typeof callbackSuccess === 'function') {
                        callbackSuccess();
                    }
                }, {silent: true});
            }, function(error) {
                if (typeof callbackError === 'function') {
                    callbackError(error);
                }
            });
        },
        /**
         * @method loadNext
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        loadNext: function(callbackSuccess, callbackError) {
            //TODO: figure out what is next
        }
    });

    return DataItems;

});