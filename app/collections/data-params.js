var GelatoCollection = require('gelato/modules/collection');
var DataParam = require('models/data-param');

/**
 * @class DataParams
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
     * @type {DataParam}
     */
    model: DataParam
});
