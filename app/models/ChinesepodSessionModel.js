const SkritterModel = require('base/BaseSkritterModel');

/**
 * @class ChinesepodSessionModel
 * @extends {SkritterModel}
 */
const ChinesepodSessionModel = SkritterModel.extend({

  /**
   * @property idAttribute
   * @type {String}
   */
  idAttribute: 'id',

  /**
   * @method urlRoot
   * @returns {String}
   */
  url: 'cpod/login',

  /**
   * @method parse
   * @returns {Object}
   */
  parse: function(response) {
    return response.ChinesePodSession || response;
  },

});

module.exports = ChinesepodSessionModel;
