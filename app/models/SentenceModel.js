const GelatoModel = require('gelato/model');

/**
 * @class SentenceModel
 * @extends {GelatoModel}
 */
const SentenceModel = GelatoModel.extend({
  /**
   * @property idAttribute
   * @type String
   */
  idAttribute: 'id',

  /**
   * Gets the sentence definition based on the user's source language
   * @method getDefinition
   * @param {Boolean} [ignoreFormat] whether to return the un-HTML-ified
   *                                  version of the definition without bold,
   *                                  italics, etc.
   * @returns {String} the definition in the user's language, or English if not available
   */
  getDefinition: function(ignoreFormat) {
    let definition = this.get('definitions')[app.user.get('sourceLang')];

    if (!definition) {
      definition = this.get('definitions').en;
    }

    return ignoreFormat === false ? definition : app.fn.textToHTML(definition);
  },

  /**
   * Gets the rune writing for a sentence
   * @method getWriting
   * @param {String} [mask] portion of the writing to search and replace with underscores
   * @param {VocabModel} vocab the vocab for the sentence
   * @returns {String}
   */
  getWriting: function(mask, vocab) {
    let writing = this.get('sentenceRune');

    if (app.getLanguage() === 'zh') {

      if (vocab) {
        if (vocab.get('style') === 'trad' ||
          (vocab.get('style') === 'both' && !app.user.get('reviewSimplified'))) {
          writing = this.get('runeTraditional');
        } else {
          writing = this.get('runeSimplified');
        }
      } else {
        writing = this.get('runeSimplified');
      }
    }

    if (mask !== undefined && typeof mask === 'string') {
      const pieces = mask.split('');

      for (let i = 0, length = pieces.length; i < length; i++) {
        writing = writing.replace(new RegExp(_.escapeRegExp(pieces[i]), 'g'), '_');
      }
    }

    return writing.replace(/\s+/g, '');
  }

});

module.exports = SentenceModel;
