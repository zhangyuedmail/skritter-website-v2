const BaseSkritterCollection = require('base/BaseSkritterCollection');
const VocablistHistoryModel = require('models/VocablistHistoryModel');

/**
 * @class VocablistHistoryCollection
 * @extends {BaseSkritterCollection}
 */
const VocablistHistoryCollection = BaseSkritterCollection.extend({

  /**
   * @property model
   * @type {VocablistHistoryModel}
   */
  model: VocablistHistoryModel,

  /**
   *
   * @param models
   * @param options
   * @method initialize
   */
  initialize: function (models, options) {
    if (!options) {
      throw Error('vocablist-history collection requires a vocablist \'id\' option sent to the constructor.');
    }

    this.id = options.id;
    this.url = 'vocablists/' + this.id + '/changes';

    BaseSkritterCollection.prototype.initialize.call(this);
  },

  /**
   * @method parse
   * @param {Object} response
   * @returns Array<Object>
   */
  parse: function (response) {
    return response.VocabListChanges;
  },
});

module.exports = VocablistHistoryCollection;
