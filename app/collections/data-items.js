var GelatoCollection = require('gelato/modules/collection');
var DataItem = require('models/data-item');

/**
 * @class DataItems
 * @extends {GelatoCollection}
 */
module.exports = GelatoCollection.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {},
    /**
     * @property model
     * @type {DataItem}
     */
    model: DataItem,
    /**
     * @method fetch
     * @param {Function} [callbackSuccess]
     * @param {Function} [callbackError]
     */
    fetch: function(callbackSuccess, callbackError) {
        var self = this;
        (function next(cursor) {
            app.api.fetchItems({
                cursor: cursor,
                lang: app.get('language'),
                offset: moment().startOf('day').add(3, 'hours').unix(),
                sort: 'changed'
            }, function(result) {
                app.user.data.add(result);
                if (result.cursor) {
                    next(result.cursor);
                } else {
                    self.trigger('update', self);
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
     * @method getItemAddedCount
     * @returns {Number}
     */
    getAddedCount: function() {
        var today = moment().startOf('day').add(3, 'hours').unix();
        return _.filter(this.models, function(item) {
            return item.get('created') >= today;
        }).length;
    },
    /**
     * @method getItemReviewedCount
     * @returns {Number}
     */
    getReviewedCount: function() {
        var today = moment().startOf('day').add(3, 'hours').unix();
        return _.filter(this.models, function(item) {
            return item.attributes.last >= today;
        }).length;
    }
});
