const SkritterModel = require('base/BaseSkritterModel');

/**
 * @class CancellationModel
 * @extends {SkritterModel}
 */
const CancellationModel = SkritterModel.extend({

  /**
   * @property idAttribute
   * @type {String}
   */
  idAttribute: 'id',

  /**
   * @property urlRoot
   */
  urlRoot: 'cancellation',

  /**
   * @method parse
   * @returns {Object}
   */
  parse: function (response) {
    return response.Cancellation || response;
  },

});

module.exports = CancellationModel;
