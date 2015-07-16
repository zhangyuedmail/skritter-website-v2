var GelatoCollection = require('gelato/modules/collection');
var DataParam = require('models/data-param');
var ParamData = require('data/param-data');

/**
 * @class DataParams
 * @extends {GelatoCollection}
 */
module.exports = GelatoCollection.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.add(ParamData.getData());
    },
    /**
     * @property model
     * @type {DataParam}
     */
    model: DataParam
});
