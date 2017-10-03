const ChinesePodLabelModel = require('models/ChinesepodLabelModel');
const BaseSkritterCollection = require('base/BaseSkritterCollection');

/**
 * @class ChinesepodLabelCollection
 * @extends {BaseSkritterCollection}
 */
const ChinesepodLabelCollection = BaseSkritterCollection.extend({

  /**
   * @property model
   * @type {ChinesePodLabelModel}
   */
  model: ChinesePodLabelModel,

  /**
   * @property url
   * @type {String}
   */
  url: 'cpod/labels',

  /**
   * @method parse
   * @param {Object} response
   * @returns Array<Object>
   */
  parse: function(response) {
    return response.ChinesePodLists;
  },
});

module.exports = ChinesepodLabelCollection;
