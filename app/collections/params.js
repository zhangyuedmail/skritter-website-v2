var GelatoCollection = require('gelato/collection');
var Param = require('models/param');
var ParamData = require('data/param-data');

/**
 * @class Params
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
     * @type {Param}
     */
    model: Param
});
