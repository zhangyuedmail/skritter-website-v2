const GelatoModel = require('gelato/model');

/**
 * @class ParamModel
 * @extends {GelatoModel}
 */
const ParamModel = GelatoModel.extend({

  /**
   * @property idAttribute
   * @type {String}
   */
  idAttribute: 'id',

  /**
   * @method defaults
   * @returns {Object}
   */
  defaults: function() {
    return {
      contains: [],
      corners: [],
      strokeId: undefined,
    };
  },

  /**
   * @method angle
   * @returns {Number}
   */
  getAngle: function() {
    return app.fn.getAngle(this.get('corners'));
  },

  /**
   * @method getFirstAngle
   * @returns {Number}
   */
  getFirstAngle: function() {
    return app.fn.getAngle(this.get('corners')[0], this.get('corners')[1]);
  },

  /**
   * @method getCornerLength
   * @returns {Number}
   */
  getLength: function() {
    let cornersLength = 0;
    let corners = _.clone(this.get('corners'));
    for (let i = 0, length = corners.length - 1; i < length; i++) {
      cornersLength += app.fn.getDistance(corners[i], corners[i + 1]);
    }
    return cornersLength;
  },

  /**
   * @method getRectangle
   * @returns {Object}
   */
  getRectangle: function() {
    let corners = _.clone(this.get('corners'));
    return app.fn.getBoundingRectangle(corners, this.size, this.size, 18);
  },

});

module.exports = ParamModel;
