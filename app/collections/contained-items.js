var GelatoCollection = require('gelato/collection');
var Item = require('models/item');

/**
 * @class ContainedItems
 * @extends {GelatoCollection}
 */
module.exports = GelatoCollection.extend({
    /**
     * @property model
     * @type {Item}
     */
    model: Item
});
