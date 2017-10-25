const SkritterModel = require('base/BaseSkritterModel');

/**
 * @class CancellationReasonModel
 * @extends {SkritterModel}
 */
const CancellationReasonModel = SkritterModel.extend({

  /**
   * @property idAttribute
   * @type {String}
   */
  idAttribute: 'id',

  /**
   * @property urlRoot
   */
  urlRoot: 'cancellationreason',

  /**
   * @method parse
   * @returns {Object}
   */
  parse: function (response) {
    return response.CancellationReason || response;
  },

});

module.exports = CancellationReasonModel;
