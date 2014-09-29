/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/user/HistoryItem'
], function(BaseCollection, HistoryItem) {
    /**
     * @class HistoryItems
     * @extend BaseCollection
     */
    var HistoryItems = BaseCollection.extend({
        /**
         * @method initialize
         * @param {Array} models
         * @param {Object} options
         * @constructor
         */
        initialize: function(models, options) {
            options = options ? options : {};
            this.user = options.user;
            this.on('add', this.cache);
        },
        /**
         * @property model
         * @type HistoryItem
         */
        model: HistoryItem,
        /**
         * @method cache
         */
        cache: function() {
            if (this.length > 5) {
                this.pop();
            }
            localStorage.setItem(this.user.id + '-history', JSON.stringify(this.toJSON()));
        },
        /**
         * @method comparator
         * @param {HistoryItem} item
         * @returns {Number}
         */
        comparator: function(item) {
            return -item.attributes.timestamp;
        },
        /**
         * @method hasBase
         * @returns {Boolean}
         */
        hasBase: function(base) {
            return this.where({base: base}).length ? true : false;
        }
    });

    return HistoryItems;
});