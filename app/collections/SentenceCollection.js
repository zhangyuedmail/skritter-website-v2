const GelatoCollection = require('gelato/collection');
const SentenceModel = require('models/SentenceModel');

/**
 * @class SentencesCollection
 * @extends {GelatoCollection}
 */
const SentencesCollection = GelatoCollection.extend({

  /**
   * @property model
   * @type {SentenceModel}
   */
  model: SentenceModel,
});

module.exports = SentencesCollection;
