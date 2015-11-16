var Collection = require('base/collection');
var Decomp = require('models/decomp');

/**
 * @class Decomps
 * @extends {Collection}
 */
module.exports = Collection.extend({
    /**
     * @property model
     * @type {Decomp}
     */
    model: Decomp
});
