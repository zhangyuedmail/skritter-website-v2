var GelatoCollection = require('gelato/collection');
var Decomp = require('models/decomp');

/**
 * @class Decomps
 * @extends {GelatoCollection}
 */
module.exports = GelatoCollection.extend({
    /**
     * @property model
     * @type {Decomp}
     */
    model: Decomp
});
