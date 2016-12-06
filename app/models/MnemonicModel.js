const SkritterModel = require('base/BaseSkritterModel');

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
   * @method initialize
   * @constructor
   */
  initialize: function() {
  },

  /**
   * Function that returns an HTML-formatted version of the mnemonic
   * which supports italics, bold, etc.
   * @method formatText
   */
  getFormattedText: function() {
    // TODO:
    return this.get('text');
  }
});

module.exports = MnemonicModel;
