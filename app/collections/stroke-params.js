var Collection = require('base/collection');
var StrokeParam = require('models/stroke-param');
var ParamData = require('data/param-data');

/**
 * @class StrokeParams
 * @extends {Collection}
 */
module.exports = Collection.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.add(ParamData.getData());
    },
    /**
     * @property model
     * @type {StrokeParam}
     */
    model: StrokeParam
});
