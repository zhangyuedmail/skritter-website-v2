var SkritterModel = require('base/skritter-model');

/**
 * @class Review
 * @extends {SkritterModel}
 */
module.exports = SkritterModel.extend({
  /**
   * @method defaults
   * @returns {Object}
   */
  defaults: function() {
    return {
      created: null,
      data: [],
      promptItems: null
    };
  },
  /**
   * @property idAttribute
   * @type String
   */
  idAttribute: 'group'
});
