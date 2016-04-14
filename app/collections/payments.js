var Payment = require('models/payment');
var SkritterCollection = require('base/skritter-collection');

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
  model: Payment,
  /**
   * @method parse
   * @param {Object} response
   * @returns Array
   */
  parse: function(response) {
    this.cursor = response.cursor;
    return response.Payments;
  },
  /**
   * @property url
   * @type {String}
   */
  url: 'payments'
});
