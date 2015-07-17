var GelatoCollection = require('gelato/collection');
var DataSentence = require('models/data-sentence');

/**
 * @class DataSentences
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
     * @type {DataSentence}
     */
    model: DataSentence
});
