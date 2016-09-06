const GelatoCollection = require('gelato/collection');
const StrokeParamsCollection = require('collections/StrokeParamCollection');
const KanaStrokes = require('data/kana-strokes');
const ToneStrokes = require('data/tone-strokes');
const StrokeModel = require('models/StrokeModel');

//TODO: replace stroke shapes with a collection
//var StrokeShapes = require('collections/stroke-shapes');
const ShapeData = require('data/shape-data');

/**
 * @class StrokeCollection
 * @extends {GelatoCollection}
 */
const StrokeCollection = GelatoCollection.extend({

  /**
   * @property model
   * @type {StrokeModel}
   */
  model: StrokeModel,

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.params = new StrokeParamsCollection();
    this.shapes = ShapeData;
    this.add(KanaStrokes.getData());
    this.add(ToneStrokes.getData());
  },

  /**
   * @method reset
   * @returns {StrokeCollection}
   */
  reset: function() {
    GelatoCollection.prototype.reset.call(this);
    this.add(KanaStrokes.getData());
    this.add(ToneStrokes.getData());

    return this;
  },

  /**
   * @method getPromptTones
   * @returns {PromptCharacter}
   */
  getPromptTones: function() {
    return this.get('tones').getPromptCharacter();
  }
});

module.exports = StrokeCollection;
