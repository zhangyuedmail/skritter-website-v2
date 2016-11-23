const GelatoModel = require('gelato/model');

/**
 * @class PromptStrokeModel
 * @extends {GelatoModel}
 */
const PromptStrokeModel = GelatoModel.extend({

  /**
   * @property idAttribute
   * @type String
   */
  idAttribute: 'id',

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.on('change:points', this.updateCorners);
    this.updateCorners();
  },

  /**
   * @method defaults
   * @returns {Object}
   */
  defaults: function() {
    return {
      tweening: false
    };
  },

  /**
   * @method getFirstAngle
   * @returns {Number}
   */
  getFirstAngle: function() {
    return app.fn.getAngle(this.get('corners')[0], this.get('corners')[1]);
  },

  /**
   * @method getParamPath
   * @returns {ParamModel}
   */
  getParamPath: function() {
    //TODO: make sure to get the trace parameter
    let matrix = this.getTargetShape().getMatrix();
    let param = this.get('params')[0];
    if (!param) {
      let params = this.get('params');
      param = params[params.length - 1];
    }
    param = param.clone();
    let corners = _.cloneDeep(param.get('corners'));
    for (let i = 0, length = corners.length; i < length; i++) {
      let inflatedCorner = matrix.transformPoint(corners[i].x, corners[i].y);
      corners[i].x = inflatedCorner.x;
      corners[i].y = inflatedCorner.y;
    }
    param.set('corners', corners);
    return param.get('corners');
  },

  /**
   * @method getParams
   * @returns {Array}
   */
  getParams: function() {
    let inflatedParams = [];
    let size = this.getSize();
    let matrix = this.getTargetShape().getMatrix();
    let params = this.get('params');
    for (let a = 0, lengthA = params.length; a < lengthA; a++) {
      let param = params[a].clone();
      if (!param.has('trace')) {
        let corners = _.cloneDeep(param.get('corners'));
        for (let b = 0, lengthB = corners.length; b < lengthB; b++) {
          let inflatedCorner = matrix.transformPoint(corners[b].x, corners[b].y);
          corners[b].x = inflatedCorner.x;
          corners[b].y = inflatedCorner.y;
        }
        param.set({'corners': corners});
        param.size = size;
        inflatedParams.push(param);
      }
    }
    return inflatedParams;
  },

  /**
   * @method size
   * @returns {Number}
   */
  getSize: function() {
    return app.get('canvasSize');
  },

  /**
   * @method getTargetShape
   * @return {createjs.Shape}
   */
  getTargetShape: function() {
    let data = this.inflateData();
    let shape = this.get('shape').clone(true);

    shape.x = data.x;
    shape.y = data.y;
    shape.scaleX = data.scaleX;
    shape.scaleY = data.scaleY;
    shape.rotation = data.rotation;

    shape.name = 'stroke-' + this.get('position');

    return shape;
  },

  /**
   * @method getUserRectangle
   * @returns {Object}
   */
  getUserRectangle: function() {
    let size = this.getSize();
    let corners = _.clone(this.get('corners'));
    return app.fn.getBoundingRectangle(corners, size, size, 18);
  },

  /**
   * @method getUserShape
   * @returns {createjs.Shape}
   */
  getUserShape: function() {
    //TODO: improve stroke position and size
    //let size = this.getSize();
    //shape.scaleX = rect.width / bounds.width;
    //shape.scaleY = rect.height / bounds.height;
    //let bounds = shape.getBounds();
    let shape = this.getTargetShape();
    let rect = this.getUserRectangle();
    shape.x = rect.x;
    shape.y = rect.y;
    shape.name = 'stroke-' + this.get('strokeId');
    return shape;
  },

  /**
   * @method getUserSquig
   * @returns {createjs.Shape}
   */
  getUserSquig: function() {
    return this.get('squig');
  },

  /**
   * @method inflatedData
   * @return {Object}
   */
  inflateData: function() {
    let size = this.getSize();
    let data = this.get('data');
    return {
      shapeId: data.shapeId,
      x: data.x * size,
      y: data.y * size,
      scaleX: data.scaleX * size,
      scaleY: data.scaleY * size,
      rotation: data.rotation
    };
  },

  /**
   * @method isKana
   * @returns {Boolean}
   */
  isKana: function() {
    return this.get('strokeId') >= 600 && this.get('strokeId') <= 834;
  },

  /**
   * @method updateCorners
   * @returns {PromptStrokeModel}
   */
  updateCorners: function() {
    let points = _.clone(this.get('points'));
    this.set('corners', app.fn.shortstraw.process(points));
    return this;
  }

});

module.exports = PromptStrokeModel;
