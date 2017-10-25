const GelatoCollection = require('gelato/collection');
const DecompModel = require('models/DecompModel');

/**
 * @class DecompsCollection
 * @extends {GelatoCollection}
 */
const DecompsCollection = GelatoCollection.extend({

  /**
   * @property model
   * @type {DecompModel}
   */
  model: DecompModel,
});

module.exports = DecompsCollection;
