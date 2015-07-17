var GelatoCollection = require('gelato/collection');
var DataVocab = require('models/data-vocab');

/**
 * @class DataVocabs
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
     * @type {DataVocab}
     */
    model: DataVocab
});
