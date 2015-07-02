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
            this.active = [];
            this.sorted = Moment().unix();
        },
        /**
         * @property model
         * @type DataItem
         */
        model: DataItem,
        /**
         * @method comparator
         * @param {DataItem} item
         */
        comparator: function(item) {
            return -item.getReadiness(this.sorted);
        },
        /**
         * @method addActive
         * @param {Array} items
         */
        addActive: function(items) {
            var itemIds = _.pluck(items|| [], 'id');
            this.active = _.uniq(this.active.concat(itemIds));
        },
        /**
         * @method fetch
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        fetch: function(callbackSuccess, callbackError) {
            (function next(cursor) {
                app.api.fetchItems({
                    cursor: cursor,
                    lang: app.user.getLanguageCode(),
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
         * @param {Object} [options]
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        fetchNext: function(options, callbackSuccess, callbackError) {
            var self = this;
            options = options || {};
            options.limit = options.limit || 1;
            console.log('FETCHING:', options.limit);
            app.api.fetchItems({
                cursor: options.cursor,
                include_contained: true,
                include_decomps: true,
                include_sentences: true,
                include_strokes: true,
                include_top_mnemonics: true,
                include_vocabs: true,
                lang: app.user.getLanguageCode(),
                limit: options.limit,
                parts: app.user.settings.getRequestParts(),
                sort: 'next',
                styles: app.user.settings.getRequestStyles()
            }, function(result) {
                self.addActive(result.Items);
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
            this.sort();
            for (var i = 0, length = this.length; i < length; i++) {
                var item = this.at(i);
                if (this.active.indexOf(item.id) > -1 && item.isReady()) {
                    console.log('NEXT:', item.id);
                    return item;
                }
            }
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
         * @method sort
         * @returns {Array}
         */
        sort: function() {
            this.sorted = Moment().unix();
            return GelatoCollection.prototype.sort.call(this);
        }
    });

    return DataItems;

});