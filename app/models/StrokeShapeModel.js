const GelatoModel = require('gelato/model');

/**
 * @class StrokeShapeModel
 * @extends {GelatoModel}
 */
const StrokeShapeModel = GelatoModel.extend({

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

});

module.exports = StrokeShapeModel;
