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
            this.lastSorted = null;
        },
        /**
         * @property model
         * @type DataItem
         */
        model: DataItem,
        /**
         * @method comparator
         * @param {DataItem} item
         * @returns {Number}
         */
        comparator: function(item) {
            return -item.getReadiness();
        },
        /**
         * @method fetchNext
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        fetchChanged: function(callbackSuccess, callbackError) {
            var self = this;
            (function next(cursor) {
                app.api.fetchItems({
                    cursor: cursor,
                    offset: app.user.data.get('lastItemUpdate'),
                    sort: 'changed'
                }, function(result) {
                    app.user.data.insert(result, function() {
                        self.add(result.Items, {merge: true});
                        if (result.cursor) {
                            next(result.cursor);
                        } else {
                            app.user.data.set('lastItemUpdate', Moment().unix());
                            self.trigger('change', self);
                            if (typeof callbackSuccess === 'function') {
                                callbackSuccess();
                            }
                        }
                    }, function(error) {
                        if (typeof callbackError === 'function') {
                            callbackError(error);
                        }
                    });
                }, function(error) {
                    if (typeof callbackError === 'function') {
                        callbackError(error);
                    }
                });
            })();
        },
        /**
         * @method fetchNext
         * @param {Function}
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        fetchNext: function(limit, callbackSuccess, callbackError) {
            var self = this;
            app.api.fetchItems({
                sort: 'next',
                include_contained: true,
                include_decomps: true,
                include_sentences: true,
                include_strokes: true,
                include_top_mnemonics: true,
                include_vocabs: true,
                limit: 5
            }, function(result) {
                var items = result.Items;
                result.Items = result.Items.concat(result.ContainedItems || []);
                app.user.data.insert(result, function() {
                    callbackSuccess(self.add(items));
                }, function(error) {
                    callbackError(error);
                });
            }, function(error) {
                callbackError(error);
            });
        },
        /**
         * @method getActive
         * @returns {Array}
         */
        getActive: function() {
            return this.sort().filter(function(item) {
                return item.get('vocabIds').length;
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
         * @method getLast
         * @param {Number} [quantity]
         * @returns {Array}
         */
        getLast: function(quantity) {
            return this.sortBy(function(item) {
                return -item.get('last');
            }).slice(0, quantity || 1);
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
            if (this.length) {
                var items = this.getActive();
                var last = this.getLast(4);
                for (var i = 0, length = items.length; i < length; i++) {
                    var item = items[0];
                    if (last.indexOf(item.id) === -1) {
                        item.load(function(result) {
                            callbackSuccess(result);
                        }, function(error) {
                            callbackError(error);
                        });
                        return;
                    } else {
                        console.log('SKIPPING FUCKING ITEM!');
                    }
                }
            } else {
                callbackError(new Error('No items founds.'));
            }
        },
        /**
         * @method printSchedule
         */
        printSchedule: function() {
            this.sort();
            for (var i = 0, length = this.length; i < length; i++) {
                var item = this.at(i);
                console.log(item.id, item.getReadiness());
            }
        },
        /**
         * @method sort
         * @returns {Array}
         */
        sort: function() {
            this.lastSorted = Moment().unix();
            return GelatoCollection.prototype.sort.call(this);
        }
    });

    return DataItems;

});