const GelatoCollection = require('gelato/collection');
const StrokeParamModel = require('models/StrokeParamModel');
const ParamData = require('data/param-data');

/**
 * @class StrokeParamCollection
 * @extends {GelatoCollection}
 */
const StrokeParamCollection = GelatoCollection.extend({

  /**
   * @property model
   * @type {StrokeParamModel}
   */
  model: StrokeParamModel,

  /**
   * @method initialize
   * @constructor
   */
  initialize: function () {
    this.add(ParamData.getData());
  },
});

module.exports = StrokeParamCollection;
