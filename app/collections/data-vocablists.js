var GelatoCollection = require('gelato/modules/collection');
var DataVocablist = require('models/data-vocablist');

/**
 * @class DataVocablists
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
     * @type {DataVocablist}
     */
    model: DataVocablist
});
