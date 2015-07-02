var GelatoCollection = require('gelato/modules/collection');
var DataStroke = require('models/data-stroke');

/**
 * @class DataStrokes
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
     * @type {DataStroke}
     */
    model: DataStroke
});
