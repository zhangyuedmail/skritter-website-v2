var Collection = require('base/collection');
var Item = require('models/item');

/**
 * @class ContainedItems
 * @extends {Collection}
 */
module.exports = Collection.extend({
    /**
     * @property model
     * @type {Item}
     */
    model: Item
});
