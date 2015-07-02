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
    model: DataItem
});
