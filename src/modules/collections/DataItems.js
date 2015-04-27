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
        initialize: function() {
            this.activeParts = null;
            this.activeStyles = null;
            this.languageCode = null;
            this.filtered = [];
        },
        /**
         * @property model
         * @type DataItem
         */
        model: DataItem,
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
                    localDue = self.getDue().length;
                    callback();
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
         * @method getItemAddedCount
         * @returns {Number}
         */
        getAddedCount: function() {
            var today = Moment().startOf('day').add(3, 'hours').unix();
            return _.filter(this.models, function(item) {
                return item.attributes.created >= today;
            }).length;
        },
        /**
         * @method getMissingIds
         * @returns {Array}
         */
        getMissingIds: function() {
            return _.filter(this.models, function(item) {
                return item.attributes.next === undefined;
            }).map(function(item) {
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
         * @method hasMissing
         * @return {Boolean}
         */
        hasMissing: function() {
            return this.getMissingIds().length ? true : false;
        },
        /**
         * @method load
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        load: function(callbackSuccess, callbackError) {
            var self = this;
            app.user.storage.all('items', function(result) {
                self.lazyAdd(result, function() {
                    self.updateFilter();
                    self.sortFilter();
                    if (typeof callbackSuccess === 'function') {
                        callbackSuccess();
                    }
                }, {merge: true, silent: true, sort: false});
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
            var self = this;
            Async.waterfall([
                function(callback) {
                    self.sortFilter();
                    if (self.filtered.length) {
                        callback();
                    } else {
                        self.fetchNext(function() {
                            self.updateFilter();
                            self.sortFilter();
                            callback();
                        }, function() {
                            callback();
                        });
                    }
                },
                function(callback) {
                    if (self.filtered.length) {
                        self.filtered[0].load(function(item) {
                            callback(null, item);
                        }, function(error) {
                            callback(error);
                        });
                    } else {
                        callback(new Error('Unable to load next items.'));
                    }
                }
            ], function(error, item) {
                if (error) {
                    callbackError(error);
                } else {
                    callbackSuccess(item);
                }
            });
        },
        /**
         * @method sortFilter
         * @returns {Array}
         */
        sortFilter: function() {
            this.filtered = _.sortBy(this.filtered, function(item) {
                return item.get('next');
            });
            return this.filtered;
        },
        /**
         * @method updateFilter
         * @returns {Array}
         */
        updateFilter: function() {
            this.activeParts = app.user.settings.getActiveParts();
            this.activeStyles = app.user.settings.getActiveStyles();
            this.languageCode = app.user.getLanguageCode();
            this.filtered = _.filter(this.models, function(item) {
                return item.isValid();
            });
            return this.filtered;
        }
    });

    return DataItems;

});