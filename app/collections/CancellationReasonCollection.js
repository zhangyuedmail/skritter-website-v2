const CancellationReasonModel = require('models/CancellationReasonModel');
const BaseSkritterCollection = require('base/BaseSkritterCollection');

/**
 * @class CancellationReasonCollection
 * @extends {BaseSkritterCollection}
 */
const CancellationReasonCollection = BaseSkritterCollection.extend({

  /**
   * @property comparator
   */
  comparator: 'priority',

  /**
   * @property model
   * @type {Model}
   */
  model: CancellationReasonModel,

  /**
   * @property url
   * @type {String}
   */
  url: 'cancellationreason',

  /**
   * @method parse
   * @param {Object} response
   * @returns Array
   */
  parse: function (response) {
    return response.CancellationReasons;
  },
});

module.exports = CancellationReasonCollection;
