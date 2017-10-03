const GelatoCollection = require('gelato/collection');
const StrokeShapeModel = require('models/StrokeShapeModel');
const ShapeData = require('data/shape-data');

/**
 * @class StrokeShapeCollection
 * @extends {GelatoCollection}
 */
const StrokeShapeCollection = GelatoCollection.extend({
  /**
   * @property model
   * @type {StrokeShapeModel}
   */
  model: StrokeShapeModel,

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.add(ShapeData.getData());
  },
});

module.exports = StrokeShapeCollection;
