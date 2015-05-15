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