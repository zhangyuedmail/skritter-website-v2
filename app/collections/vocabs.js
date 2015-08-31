var Vocab = require('models/vocab');
var SkritterCollection = require('base/skritter-collection');

/**
 * @class Vocabs
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
   * @type {Vocab}
   */
  model: Vocab,
  /**
   * @method parse
   * @param {Object} response
   * @returns Array
   */
  parse: function(response) {
    this.cursor = response.cursor;
    return response.Vocabs;
  },
  /**
   * @property url
   * @type {String}
   */
  url: 'vocabs'
});
