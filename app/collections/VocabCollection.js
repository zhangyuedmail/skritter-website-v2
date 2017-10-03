const BaseSkritterCollection = require('base/BaseSkritterCollection');
const DecompsCollection = require('collections/DecompsCollection');
const SentenceCollection = require('collections/SentenceCollection');
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
   * @param {Array|Object} [models]
   * @param {Object} [options]
   * @constructor
   */
  initialize: function (models, options) {
    options = options || {};

    this.cursor = null;
    this.cursorContaining = null;
    this.decomps = new DecompsCollection();
    this.items = options.items;
    this.preloadAudio = _.defaultTo(options.preloadAudio, true);
    this.sentences = new SentenceCollection();
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
  parse: function (response) {
    this.cursor = response.cursor;
    this.cursorContaining = response.containingCursor;
    this.decomps.add(response.Decomps);
    this.sentences.add(response.Sentences);

    return response.Vocabs.concat(response.ContainingVocabs || []);
  },

  /**
   * @method reset
   * @returns {VocabCollection}
   */
  reset: function () {
    this.decomps.reset();
    this.sentences.reset();

    return BaseSkritterCollection.prototype.reset.apply(this, arguments);
  },
});

module.exports = VocabCollection;
