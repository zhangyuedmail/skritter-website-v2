const BaseSkritterCollection = require('base/BaseSkritterCollection');
const DecompsCollection = require('collections/DecompsCollection');
const SentenceCollection = require('collections/SentenceCollection');
const StrokeCollection = require('collections/StrokeCollection');
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
    this.strokes = new StrokeCollection();
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
    this.strokes.add(response.Strokes);

    return response.Vocabs.concat(response.ContainingVocabs || []);
  },

  /**
   * @method reset
   * @returns {VocabCollection}
   */
  reset: function() {
    this.decomps.reset();
    this.sentences.reset();
    this.strokes.reset();

    return BaseSkritterCollection.prototype.reset.call(this);
  }
});

module.exports = VocabCollection;
