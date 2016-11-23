const BaseSkritterCollection = require('base/BaseSkritterCollection');
const DecompsCollection = require('collections/DecompsCollection');
const SentenceCollection = require('collections/SentenceCollection');
const CharacterCollection = require('collections/CharacterCollection');
const VocabModel = require('models/VocabModel');

/**
 * @class VocabCollection
 * @param {Array|Object} [models]
 * @param {Object} [options]
 * @extends {BaseSkritterCollection}
 */
const VocabCollection = BaseSkritterCollection.extend({

  /**
   * @property model
   * @type {VocabModel}
   */
  model: VocabModel,

  /**
   * @property url
   * @type {String}
   */
  url: 'vocabs',

  /**
   * @method initialize
   * @constructor
   */
  initialize: function(models, options) {
    options = options || {};
    this.cursor = null;
    this.cursorContaining = null;
    this.decomps = new DecompsCollection();
    this.items = options.items;
    this.sentences = new SentenceCollection();
    this.character = new CharacterCollection();
  },

  /**
   * @method getUniqueWritings
   * @returns Array
   */
  getUniqueWritings: function () {
    return _
      .chain(this.models)
      .map(
        function (value) {
          return value.get('writing').split('');
        }
      )
      .flatten()
      .uniq()
      .value();
  },

  /**
   * @method parse
   * @param {Object} response
   * @returns Array
   */
  parse: function(response) {
    this.cursor = response.cursor;
    this.cursorContaining = response.containingCursor;
    this.decomps.add(response.Decomps);
    this.sentences.add(response.Sentences);
    this.character.add(response.Strokes);

    return response.Vocabs.concat(response.ContainingVocabs || []);
  },

  /**
   * @method reset
   * @returns {VocabCollection}
   */
  reset: function() {
    this.decomps.reset();
    this.sentences.reset();
    this.character.reset();

    return BaseSkritterCollection.prototype.reset.call(this);
  }
});

module.exports = VocabCollection;
