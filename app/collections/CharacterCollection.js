const GelatoCollection = require('gelato/collection');
const StrokeParamsCollection = require('collections/StrokeParamCollection');
const KanaStrokes = require('data/kana-strokes');
const ShapeData = require('data/shape-data');
const ToneStrokes = require('data/tone-strokes');
const CharacterModel = require('models/CharacterModel');

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
   * @property url
   * @type {String}
   */
  url: function () {
    return app.getApiUrl(2) + 'characters';
  },

  /**
   * @method initialize
   * @constructor
   */
  initialize: function () {
    this.params = new StrokeParamsCollection();
    this.shapes = ShapeData;
    this.add(KanaStrokes.getData());
    this.add(ToneStrokes.getData());
  },

  /**
   * @method getPromptTones
   * @returns {PromptCharacter}
   */
  getPromptTones: function () {
    return this.findWhere({writing: 'tones'}).getPromptCharacter();
  },

  /**
   * @method reset
   * @returns {CharacterCollection}
   */
  reset: function () {
    GelatoCollection.prototype.reset.call(this);
    this.add(KanaStrokes.getData());
    this.add(ToneStrokes.getData());

    return this;
  },
});

module.exports = CharacterCollection;
