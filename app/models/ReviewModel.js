const SkritterModel = require('base/BaseSkritterModel');

/**
 * @class ReviewModel
 * @extends {SkritterModel}
 */
const ReviewModel = SkritterModel.extend({

  /**
   * @property idAttribute
   * @type String
   */
  idAttribute: 'group',

  /**
   * @method defaults
   * @returns {Object}
   */
  defaults: function () {
    return {
      data: [],
    };
  },

});

module.exports = ReviewModel;
