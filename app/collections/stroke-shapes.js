var Collection = require('base/collection');
var StrokeShape = require('models/stroke-shape');
var ShapeData = require('data/shape-data');

/**
 * @class StrokeShapes
 * @extends {Collection}
 */
module.exports = Collection.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.add(ShapeData.getData());
    },
    /**
     * @property model
     * @type {StrokeShape}
     */
    model: StrokeShape
});
