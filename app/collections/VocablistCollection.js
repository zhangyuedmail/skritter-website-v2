const BaseSkritterCollection = require('base/BaseSkritterCollection');
const VocablistModel = require('models/VocablistModel');

/**
 * @class VocablistCollection
 * @extends {BaseSkritterCollection}
 */
const VocablistCollection = BaseSkritterCollection.extend({

  /**
   * @property model
   * @type {VocablistModel}
   */
  model: VocablistModel,

  /**
   * @property url
   * @type {String}
   */
  url: 'vocablists',

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.cursor = null;
  },

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
    return _.filter(
      this.models,
      function(vocablist) {
        return vocablist.get('studyingMode') === 'adding';
      }
    );
  },

  /**
   * @method getAdding
   */
  getReviewing: function() {
    return _.filter(
      this.models,
      function(vocablist) {
        return _.includes(['reviewing', 'finished'], vocablist.get('studyingMode'))
      }
    );
  },

  /**
   * @method resetAllPositions
   * @param {Function} [callback]
   * @returns {VocablistCollection}
   */
  resetAllPositions: function(callback) {
    async.each(
      this.models,
      function(model, callback) {
        model.resetPosition(callback);
      },
      function() {
        _.isFunction(callback) && callback();
      }
    );

    return this;
  }
});

module.exports = VocablistCollection;
