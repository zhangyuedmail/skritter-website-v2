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
         * @param {Array} [models]
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(models, options) {
            options = options || {};
            this.result = [];
        },
        /**
         * @property model
         * @type DataItem
         */
        model: DataItem,
        /**
         * @method itemComparator
         * @param {DataItem} model
         * @returns {Number}
         */
        comparator: function(model) {
            if (model.isValid()) {
                return model.attributes.next;
            }
            return Number.POSITIVE_INFINITY;
        },
        /**
         * @method fetchIds
         * @param {Function} callback
         * @param {Function} [callbackStatus]
         */
        fetchIds: function(callback, callbackStatus) {
            app.api.fetchItemIds({
                lang: app.user.getLanguageCode()
            }, function(result) {
                app.user.data.insert(result, callback);
            }, function(error) {
                callback(error);
            }, function(status) {
                if (typeof callbackStatus === 'function') {
                    callbackStatus(status);
                }
            });
        },
        /**
         * @method fetchMissing
         * @param {Function} [callback]
         * @param {Function} [callbackStatus]
         */
        fetchMissing: function(callback, callbackStatus) {
            var self = this;
            var fetchedIds = [];
            var itemMissingIds = this.getMissingIds();
            var itemOffset = this.length - itemMissingIds.length;
            var itemTotal = this.length;
            var status = 0;
            (function next() {
                var fetchIds = itemMissingIds.splice(0, 29);
                app.api.fetchItems({
                    ids: fetchIds.join('|'),
                    include_decomps: true,
                    include_strokes: true,
                    include_vocabs: true
                }, function(result) {
                    fetchedIds = fetchedIds.concat(fetchIds);
                    status = Math.floor(((fetchedIds.length + itemOffset) / itemTotal) * 100);
                    self.trigger('download:update', status, result);
                    if (typeof callbackStatus === 'function') {
                        callbackStatus(status, result);
                    }
                    app.user.data.insert(result, function(error) {
                        if (error) {
                            callback(error);
                        } else {
                            if (itemMissingIds.length) {
                                next();
                            } else {
                                self.trigger('download:complete', 100, result);
                                if (typeof callback === 'function') {
                                    self.load(callback);
                                } else {
                                    self.load();
                                }
                            }
                        }
                    });
                }, function(error) {
                    if (typeof callback === 'function') {
                        callback(error);
                    }
                });
            })();
        },
        /**
         * @method fetchNext
         * @param {Function} callback
         */
        fetchNext: function(callback) {
            app.api.fetchItems({
                sort: 'next',
                include_contained: true,
                include_decomps: true,
                include_strokes: true,
                include_vocabs: true
            }, function(result) {
                app.user.data.insert(result, callback);
            }, function(error) {
                callback(error);
            });
        },
        /**
         * @method getDue
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        getDue: function(callbackSuccess, callbackError) {
            var self = this;
            var now = Moment().unix();
            app.user.storage.bound('items', {
                bound: IDBKeyRange.upperBound(now, false),
                name: 'next'
            }, function(result) {
                callbackSuccess(self.itemFilter(result));
            }, function(error) {
                callbackError(error);
            });
        },
        /**
         * @method getDueCount
         * @param {Function} callback
         */
        getDueCount: function(callback) {
            var self = this;
            var localDue = 0;
            var serverDue = 0;
            Async.series([
                function(callback) {
                    app.api.fetchItemsDue(null, function(result) {
                        serverDue = result.total;
                        callback();
                    }, function() {
                        callback();
                    });
                },
                function(callback) {
                    self.getDue(function(result) {
                        localDue = result.length;
                        callback();
                    }, function(error) {
                        callbackError(error);
                    });
                }
            ], function(error) {
                if (error) {
                    callback(0);
                } else {
                    callback(serverDue || localDue);
                }
            });
        },
        /**
         * @method getMissingIds
         * @returns {Array}
         */
        getMissingIds: function() {
            return this.filter(function(item) {
                return item.attributes.next === undefined;
            }).map(function(item) {
                return item.id;
            });
        },
        /**
         * @method hasMissing
         * @return {Boolean}
         */
        hasMissing: function() {
            return this.getMissingIds().length ? true : false;
        },
        /**
         * @method itemFilter
         * @param {DataItems|Object} collection
         */
        itemFilter: function(collection) {
            var activeParts = app.user.settings.getActiveParts();
            var activeStyles = app.user.settings.getActiveStyles();
            var languageCode = app.user.getLanguageCode();
            return collection.filter(function(item) {
                //normalize collection for filtering
                if (item instanceof Backbone.Model) {
                    item = item.attributes;
                }
                //filter out any items not loaded yet
                if (item.changed === undefined) {
                    return false;
                }
                //filter out items that contain no vocab ids
                if (!item.vocabIds.length) {
                    return false;
                }
                //filter out items not matching an active part
                if (activeParts.indexOf(item.part) === -1) {
                    return false;
                }
                //chinese specific filters
                if (languageCode === 'zh') {
                    //filter out items not matching an active style
                    if (activeStyles.indexOf(item.style) === -1) {
                        return false;
                    }
                }
                //japanese specific filters
                if (languageCode === 'ja') {
                    //TODO: add japanese specific kana filters
                }
                return true;
            });
        },
        /**
         * @method load
         * @param {Function} [callback]
         */
        load: function(callback) {
            var self = this;
            app.user.storage.all('items', function(result) {
                self.lazyAdd(result, function() {
                    self.sort();
                    if (typeof callback === 'function') {
                        callback();
                    }
                }, {merge: true, silent: true, sort: false});
            }, function(error) {
                if (typeof callback === 'function') {
                    callback(error);
                }
            });
        },
        /**
         * @method loadNext
         * @param {Function} callback
         */
        loadNext: function(callback) {
            this.sort().at(0).load(function(result) {
                callback(result);
            }, function() {
                console.error('ITEM LOAD ERROR', error.stack);
            });
        }
    });

    return DataItems;

});