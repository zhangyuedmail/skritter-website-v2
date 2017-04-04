const BaseSkritterCollection = require('base/BaseSkritterCollection');
const VocablistModel = require('models/VocablistModel');
const GelatoCollection = require('gelato/collection');

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
   * @method sync
   * @param {String} method
   * @param {Model} model
   * @param {Object} options
   */
  sync: function(method, model, options) {
    options.headers = _.result(this, 'headers');

    if (!options.url) {
      options.url = app.getApiUrl() + _.result(this, 'url');
    }

    if (method === 'read' && app.config.useV2Gets.vocablists) {
      // options.url = 'https://api.skritter.com/v2/gae/vocablists';
      options.url = app.getApiUrl(2) + 'gae/vocablists';
    }

    GelatoCollection.prototype.sync.call(this, method, model, options);
  },

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
  },

  /**
   * Changes the comparator for this instance of the collection
   * @param {String} strategy the name of the sortStrategy to use
   */
  setSort: function(strategy) {
    if (this.sortStrategies[strategy]) {
      this.comparator = this.sortStrategies[strategy];
    }
  },

  /**
   * An object with different ways to sort this collection
   */
  sortStrategies: {

    /**
     * A sort function that gives active lists a higher order than inactive,
     * and within those groups orders by progress.
     * @param {VocablistModel} a
     */
    activeCompletion: function(a) {
      const studyingModes = {
        'adding': 0,
        'active': 101,
        'reviewing': 201,
        'finished': 301
      };

      const aValue = studyingModes[a.get('studyingMode')] + a.get('percentDone');

      return aValue;
    }
  }
});

module.exports = VocablistCollection;
