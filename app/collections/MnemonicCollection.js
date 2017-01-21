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
   * @method sync
   * @param {String} method
   * @param {Model} model
   * @param {Object} options
   */
  sync: function(method, model, options) {
    options.headers = app.user.session.getHeaders();

    GelatoCollection.prototype.sync.call(this, method, model, options);
  },

  /**
   * @property url
   * @type {String}
   */
  url: function() {
    return app.getApiUrl(2) + 'mnemonics/?languageCode=' + app.user.get('targetLang') + '&vocabId=' + this.vocab.id;
  },

  /**
   * @method initialize
   * @constructor
   */
  initialize: function(models, options) {
    options = options || {};

    this.vocab = options.vocab;
  },

  /**
   * Gets the number of unused mnemonics for a vocab, filtering out against
   * the currently selected mnemonic for this vocab.
   * @param {Object} [mnemonic] a current mnemonic to test against
   * @return {Number} the number of unlinked mnemonics in the collection for the current user
   */
  getUnusedLength: function(mnemonic) {
    if (!mnemonic) {
      return this.models.length;
    }

    return this.models.filter(function(model) {
      return model.get('text') !== mnemonic.text && model.get('author') !== mnemonic.creator;
    }).length;
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
