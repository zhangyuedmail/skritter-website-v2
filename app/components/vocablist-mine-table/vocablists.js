var DataVocablist = require('models/data-vocablist');
var GelatoCollection = require('gelato/collection');

/**
 * @class MyVocablists
 * @extends {GelatoComponent}
 */
module.exports = GelatoCollection.extend({
  /**
   * @property model
   * @type {DataVocablist}
   */
  model: DataVocablist,
  /**
   * @method url
   * @returns String
   */
  url: function() {
    return app.api.getUrl() + 'vocablists';
  },
  /**
   * @method parse
   * @param {Object} response
   * @returns Array
   */
  parse: function(response) {
    this.cursor = response.cursor;
    return response.VocabLists;
  }
});