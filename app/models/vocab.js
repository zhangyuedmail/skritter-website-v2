var SkritterModel = require('base/skritter-model');

/**
 * @class Vocab
 * @extends {SkritterModel}
 */
module.exports = SkritterModel.extend({
  /**
   * @property idAttribute
   * @type {String}
   */
  idAttribute: 'id',
  /**
   * @property urlRoot
   */
  urlRoot: 'vocabs',
  /**
   * @method parse
   * @returns {Object}
   */
  parse: function(response) {
    return response.Vocab || response;
  },
  getWritingDifference: function(otherVocab) {
    var diff = _.zipWith(this.getWriting(), otherVocab.getWriting(), function(thisChar, otherChar) {
      return thisChar === otherChar ? '-' : otherChar;
    });
    return diff.join('');
  },
  /**
   * @method getBase
   * @returns {Number}
   */
  getBase: function() {
    return this.id.split('-')[1];
  },
  // everything that follows is stolen from data-vocab.js

  /**
   * @method getDefinition
   * @param {Boolean} [ignoreFormat]
   * @returns {String}
   */
  getDefinition: function(ignoreFormat) {
    var customDefinition = this.get('customDefinition');
    var definition = this.get('definitions')[app.user.get('sourceLang')];
    if (customDefinition && customDefinition !== '') {
      definition = this.get('customDefinition');
    } else if (!definition) {
      definition = this.get('definitions').en;
    }
    return ignoreFormat === false ? definition : app.fn.textToHTML(definition);
  },
  /**
   * @method getReading
   * @returns {String}
   */
  getReading: function() {
    return this.isChinese() ? app.fn.pinyin.toTone(this.get('reading')) : this.get('reading');
  },
  /**
   * @method getWriting
   * @returns {String}
   */
  getWriting: function() {
    return this.get('writing');
  },
  /**
   * @method isChinese
   * @returns {Boolean}
   */
  isChinese: function() {
    return this.get('lang') === 'zh';
  },
  /**
   * @method isJapanese
   * @returns {Boolean}
   */
  isJapanese: function() {
    return this.get('lang') === 'ja';
  },
  /**
   * @method isBanned
   * @returns {Boolean}
   */
  isBanned: function() {
    return this.get('bannedParts').length ? true : false;
  },
  /**
   * @method toggleBanned
   * @returns {Boolean}
   */
  toggleBanned: function() {
    if (this.isBanned()) {
      this.set('bannedParts', []);
      return false;
    }
    if (this.isChinese()) {
      this.set('bannedParts', ['defn', 'rdng', 'rune', 'tone']);
    } else {
      this.set('bannedParts', ['defn', 'rdng', 'rune']);
    }
    return true;
  },
  /**
   * @method getVariation
   * @returns {Number}
   */
  getVariation: function() {
    return parseInt(this.id.split('-')[2]);
  },
  /**
   * @method getMnemonic
   * @returns {Object}
   */
  getMnemonic: function() {
      if (this.get('mnemonic')) {
          return this.get('mnemonic');
      } else if (this.get('topMnemonic')) {
          return this.get('topMnemonic');
      }
      return null;
  },
  /**
   * @method getMnemonicText
   * @returns {String}
   */
  getMnemonicText: function() {
      return this.getMnemonic() ? app.fn.textToHTML(this.getMnemonic().text) : null;
  },
  /**
   * @method toggleStarred
   * @returns {Boolean}
   */
  toggleStarred: function() {
      if (this.get('starred')) {
          this.set('starred', false);
          return false;
      }
      this.set('starred', true);
      return true;
  },
  /**
   * @method isStarred
   * @returns {Boolean}
   */
  isStarred: function() {
      return this.get('starred');
  }
});
