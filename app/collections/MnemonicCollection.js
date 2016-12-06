const GelatoCollection = require('gelato/collection');
const MnemonicModel = require('models/MnemonicModel');

/**
 * A collection of mnemonics for a specific vocab
 * @class MnemonicCollection
 * @extends {GelatoCollection}
 */
const MnemonicCollection = GelatoCollection.extend({

  /**
   * @property model
   * @type {MnemonicModel}
   */
  model: MnemonicModel,

  /**
   * @property url
   * @type {String}
   */
  url: function() {
    return 'https://api.skritter.com/v2/mnemonics/?languageCode=' + app.user.get('targetLang') + '&vocab=zh-安-0';// + this.vocab.id;
  },

  initialize: function(models, options) {
    options = options || {};

    this.vocab = options.vocab;
  },

  /**
   *
   * @param {VocabModel} vocab a vocab to fetch mnemonics by
   */
  setVocab: function(vocab) {
    this.vocab = vocab;
    this.reset();
  }
});

module.exports = MnemonicCollection;
