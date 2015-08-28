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
  }
});
