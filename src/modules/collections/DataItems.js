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
            this.filtered = [];
            this.ids = [];
        },
        /**
         * @property model
         * @type DataItem
         */
        model: DataItem,
        /**
         * @method fetch
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        fetch: function(callbackSuccess, callbackError) {
            (function next(cursor) {
                app.api.fetchItems({
                    cursor: cursor,
                    offset: Moment().startOf('day').add(3, 'hours').unix(),
                    sort: 'changed'
                }, function(result) {
                    app.user.data.add(result);
                    if (result.cursor) {
                        next(result.cursor);
                    } else {
                        if (typeof callbackSuccess === 'function') {
                            callbackSuccess();
                        }
                    }
                }, function(error) {
                    if (typeof callbackError === 'function') {
                        callbackError(error);
                    }
                });
            })();
        },
        /**
         * @method fetchNext
         * @param {Number} [limit]
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        fetchNext: function(limit, callbackSuccess, callbackError) {
            var self = this;
            var activeIds = [];
            app.api.fetchItems({
                sort: 'next',
                include_contained: true,
                include_decomps: true,
                include_sentences: true,
                include_strokes: true,
                include_top_mnemonics: true,
                include_vocabs: true,
                limit: limit || 1
            }, function(result) {
                activeIds = _.pluck(result.Items, 'id');
                self.ids = _.uniq(self.ids.concat(activeIds));
                app.user.data.add(result);
                if (typeof callbackSuccess === 'function') {
                    callbackSuccess();
                }
            }, function(error) {
                if (typeof callbackError === 'function') {
                    callbackError(error);
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
                return item.get('created') >= today;
            }).length;
        },
        /**
         * @method getNext
         * @returns {DataItem}
         */
        getNext: function() {
            this.updateFilter();
            this.sortFilter();
            return this.filtered.length ? this.filtered[0] : null;
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
         * @method printSchedule
         */
        printSchedule: function() {
            var now = Moment().unix();
            this.updateFilter();
            this.sortFilter();
            console.log('-----SCHEDULE-----');
            for (var i = 0, length = this.filtered.length; i < length; i++) {
                var item = this.filtered[i];
                console.log(item.id, item.getReadiness(now));
            }
        },
        /**
         * @method updateFilter
         */
        updateFilter: function() {
            var self = this;
            this.filtered = _.filter(this.models, function(item) {
                return self.ids.indexOf(item.id) > -1;
            });
        },
        /**
         * @method sortFilter
         */
        sortFilter: function() {
            var now = Moment().unix();
            this.filtered = _.sortBy(this.filtered, function(item) {
                return -item.getReadiness(now);
            });
        }
    });

    return DataItems;

});