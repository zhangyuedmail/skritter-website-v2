var SkritterCollection = require('base/skritter-collection');
var VocablistHistoryModel = require('models/vocablist-history');

/**
 * @class ChinesePodLessons
 * @extends {SkritterCollection}
 */
module.exports = SkritterCollection.extend({

  model: VocablistHistoryModel,

  initialize: function(models, options) {
    if (!options) {
      throw "vocablist-history collection requires a vocablist 'id' option sent to the constructor.";
    }

    this.id = options.id;
    this.url = 'vocablists/' + this.id + '/changes';

    SkritterCollection.prototype.initialize.call(this);
  },

  /**
   * @method parse
   * @param {Object} response
   * @returns Array
   */
  parse: function(response) {
    return response.VocabListChanges;
  }
});
