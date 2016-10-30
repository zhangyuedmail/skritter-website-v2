const GelatoCollection = require('gelato/collection');
const StrokeParamsCollection = require('collections/StrokeParamCollection');
const KanaStrokes = require('data/kana-strokes');
const ToneStrokes = require('data/tone-strokes');
const CharacterModel = require('models/CharacterModel');

//TODO: replace stroke shapes with a collection
//var StrokeShapes = require('collections/stroke-shapes');
const ShapeData = require('data/shape-data');

/**
 * @class CharacterCollection
 * @extends {GelatoCollection}
 */
const CharacterCollection = GelatoCollection.extend({

  /**
   * @property model
   * @type {CharacterModel}
   */
  model: CharacterModel,

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
   * @returns {CharacterCollection}
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

module.exports = CharacterCollection;
