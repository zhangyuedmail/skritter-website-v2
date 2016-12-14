const SkritterModel = require('base/BaseSkritterModel');
const MenomonicHelpers = require('utils/mnemonicHelpers');

/**
 * @class CouponModel
 * @extends {SkritterModel}
 */
const MnemonicModel = SkritterModel.extend({

  /**
   * @property idAttribute
   * @type {String}
   */
  idAttribute: 'id',

  /**
   * Modifies the server's response data to fit the needs of the model
   * @param {object} attrs the original response from the server
   * @returns {object} the parsed attributes
   * @method parse
   */
  parse: function(attrs) {
    attrs['author'] = attrs.id.split('-')[0];

    return attrs;
  },

  /**
   * Checks if this model is the current mnemonic for a specific vocab
   * @param {VocabModel} vocab a model to check against
   * @returns {boolean} whether this model is the current mnemonic for that vocab
   */
  isCurrentForVocab: function(vocab) {
    const vocabMnemonic = vocab.get('mnemonic');

    return vocabMnemonic && this.get('text') === vocabMnemonic.text;
  },

  /**
   * Function that returns an HTML-formatted version of the mnemonic
   * which supports italics, bold, etc.
   * @method formatText
   */
  getFormattedText: function() {
    return MenomonicHelpers.textToHTML(this.get('text'));
  }
});

module.exports = MnemonicModel;
