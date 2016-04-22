var GelatoCollection = require('gelato/collection');
var Model = require('model');

/**
 * @class Collection
 * @extends {GelatoCollection}
 */
var Collection = GelatoCollection.extend({
  /**
   * @method initialize
   * @param {Array|Object} [models]
   * @param {Object} [options]
   * @constructor
   */
  initialize: function(models, options) {
  },
  /**
   * @property model
   * @type {Model}
   */
  model: Model,
  /**
   * @property url
   * @type {String}
   */
  url: 'model'
});

module.exports = Collection;
