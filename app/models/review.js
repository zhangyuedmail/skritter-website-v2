var SkritterModel = require('base/skritter-model');

/**
 * @class Review
 * @extends {SkritterModel}
 */
module.exports = SkritterModel.extend({

  /**
   * @property idAttribute
   * @type String
   */
  idAttribute: 'group',

  /**
   * @method defaults
   * @returns {Object}
   */
  defaults: function() {
    return {
      data: []
    };
  }

});
