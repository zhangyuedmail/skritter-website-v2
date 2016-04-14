var GelatoCollection = require('gelato/collection');
var StrokeShape = require('models/stroke-shape');
var ShapeData = require('data/shape-data');

/**
 * @class StrokeShapes
 * @extends {GelatoCollection}
 */
module.exports = GelatoCollection.extend({
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
