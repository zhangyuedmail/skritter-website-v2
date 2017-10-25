const GelatoModel = require('gelato/model');

/**
 * @class DecompModel
 * @extends {GelatoModel}
 */
const DecompModel = GelatoModel.extend({

  /**
   * @property idAttribute
   * @type String
   */
  idAttribute: 'writing',

});

module.exports = DecompModel;
