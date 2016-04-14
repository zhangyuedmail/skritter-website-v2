var SkritterCollection = require('base/skritter-collection');
var Vocablist = require('models/vocablist');

/**
 * @class Vocablists
 * @extends {SkritterCollection}
 */
module.exports = SkritterCollection.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.cursor = null;
  },
  /**
   * @property model
   * @type {Vocablist}
   */
  model: Vocablist,
  /**
   * @property url
   * @type {String}
   */
  url: 'vocablists',
  /**
   * @method parse
   * @param {Object} response
   * @returns Array
   */
  parse: function(response) {
    this.cursor = response.cursor;
    return response.VocabLists;
  },
  /**
   * @method getAdding
   */
  getAdding: function() {
    return this.filter(function(vocablist) {
      return vocablist.get('studyingMode') === 'adding';
    });
  },
  /**
   * @method getAdding
   */
  getReviewing: function() {
    return this.filter(function(vocablist) {
      return _.includes(['reviewing', 'finished'], vocablist.get('studyingMode'))
    });
  }
});
