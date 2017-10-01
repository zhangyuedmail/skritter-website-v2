/**
 * A component that displays and controls layers of canvases to render
 * study prompt content
 */
const GelatoComponent = require('gelato/component');

// only required for import side effects
require('utils/createjs-helpers');

/**
 * A dictionary that associates a layer with its specified canvas for quicker lookup
 * @type {{}}
 * @private
 */
const _layerMap = {};
/**
 * @class StudyPromptCanvasComponent
 * @extends {GelatoComponent}
 */
const StudyPromptCanvasComponent = GelatoComponent.extend({

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StudyPromptCanvasComponent.jade'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    _.bindAll(this, 'onDisplayStageTick', 'onInputMove');

    this.brushScale = 0.025;
    this.defaultFadeEasing = createjs.Ease.sineOut;
    this.defaultFadeSpeed = 1000;
    this.defaultTraceFill = '#38240c';
    this.grid = false;
    this.gridColor = '#b2b5b9';
    this.gridDashLength = 10;
    this.gridLineWidth = 0.5;
    this.mouseDownEvent = null;
    this.mouseLastDownEvent = null;
    this.mouseLastUpEvent = null;
    this.mouseTapTimeout = null;
    this.mouseUpEvent = null;
    this.prompt = options.prompt;
    this.size = 450;
    this.stage = null;
    this.strokeColor = '#4b4b4b';
    this.canvasSizeOverride = null;

    this.canvasDirty = false;

    this.downListener = null;
    this.moveListener = null;
    this.leaveListener = null;
    this.upListener = null;

    // stroke drawing variables
    this.oldPoint = null;
    this.oldMidPoint = null;
    this.points = null;
    this.marker = null;

    this.inputStage = null;
    this.displayStage = null;
    this.backgroundStage = null;
  },

  /**
   * @method render
   * @returns {StudyPromptCanvasComponent}
   */
  render: function() {
    this.renderTemplate();

    this.inputStage = this.createStage('input-canvas', true);
    this.displayStage = this.createStage('display-canvas', false, true, this.onDisplayStageTick);
    this.backgroundStage = this.createStage('background-canvas');

    this.createStageLayers();

    this.disableCanvas();
    this.enableCanvas();

    return this;
  },

  /**
   * @method clearLayer
   * @param {String} name
   * @returns {StudyPromptCanvasComponent}
   */
  clearLayer: function(name) {
    const layer = this.getLayer(name);
    const stage = _layerMap[name];

    createjs.Tween.removeTweens(layer);
    layer.removeAllChildren();
    layer.uncache();
    layer.alpha = 1;
    stage.update();

    return this;
  },

  /**
   * Adds a new layer onto a stage
   * @method createLayer
   * @param {CreateJS.Stage} stage the name of the stage to add the layer to
   * @param {String} name the name of the layer to create
   * @returns {createjs.Container}
   */
  createLayer: function(stage, name) {
    const layer = new createjs.Container();
    layer.name = 'layer-' + name;
    stage.addChild(layer);

    _layerMap[name] = stage;

    return layer;
  },

  /**
   * Makes a new CreateJS stage associated with a canvas
   * @param {String} canvasId the id of the canvas to select
   * @param {Boolean} [enableDOMEvents] whether to enable DOM events on this stage
   * @param {Boolean} [useTicker] whether this canvas should run on a createJS ticker
   * @param {Function} [tickerUpdateFn] a function that is called every tick
   * @method createStage
   * @returns {createjs.Stage}
   */
  createStage: function(canvasId, enableDOMEvents, useTicker, tickerUpdateFn) {
    const canvas = this.$('#' + canvasId).get(0);
    let stage;

    if (app.isDevelopment()) {
      stage = new createjs.Stage(canvas);
      stage._clearColor = {r: 255, g: 255, b: 255, a: 0};
    } else {
      stage = new createjs.Stage(canvas);
    }

    if (useTicker) {
      const ticker = createjs.Ticker;
      ticker.framerate = app.isMobile() ? 32 : 60;

      if (tickerUpdateFn) {
        ticker.removeEventListener('tick', tickerUpdateFn);
        ticker.addEventListener('tick', tickerUpdateFn);

        if (app.config.showCanvasFPS) {
          $('gelato-application').prepend('<div id="fps-counter" style="position:absolute;top:100px;z-index:99999;color:#EEE;background:#111;"></div>');
          const fpsCounter = $('#fps-counter');
          ticker.addEventListener('tick', () => {
            if (this.prompt.reviews && this.prompt.reviews.part === 'rune') {
              fpsCounter.text(ticker.getMeasuredFPS().toFixed(2) + ' FPS, ' + ticker.getMeasuredTickTime().toFixed(4));
            }
          });
        }
      }
    }

    stage.autoClear = true;

    if (enableDOMEvents) {
      createjs.Touch.enable(stage);
      stage.enableDOMEvents(true);
    }

    return stage;
  },

  /**
   * Creates layers in the appropriate canvas stages
   */
  createStageLayers: function() {
    this.createLayer(this.backgroundStage, 'character-grid');

    this.createLayer(this.displayStage, 'character-hint');
    this.createLayer(this.displayStage, 'character-reveal');
    this.createLayer(this.displayStage, 'character-teach');
    this.createLayer(this.displayStage, 'character');
    this.createLayer(this.displayStage, 'stroke-hint');

    this.createLayer(this.inputStage, 'input');
  },

  /**
   * @method disableCanvas
   * @returns {Canvas}
   */
  disableCanvas: function() {
    this.inputStage.removeEventListener('stagemousedown', _.bind(this.triggerCanvasMouseDown, this));
    this.inputStage.removeEventListener('stagemouseup', _.bind(this.triggerCanvasMouseUp, this));
    return this;
  },

  /**
   * @method disableGrid
   * @returns {StudyPromptCanvasComponent}
   */
  disableGrid: function() {
    this.clearLayer('character-grid');
    this.grid = false;
    return this;
  },

  /**
   * @method disableInput
   * @returns {StudyPromptCanvasComponent}
   */
  disableInput: function() {
    this.$('#input-canvas').off('.Input');
    this.inputStage.removeEventListener('stagemousedown', this.downListener);
    this.inputStage.removeEventListener('stagemousemove', this.moveListener);
    this.inputStage.removeEventListener('stagemouseup', this.upListener);
    this.inputStage.removeEventListener('mouseleave', this.leaveListener);
    return this;
  },

  /**
   * @method drawCircle
   * @param {String} layerName
   * @param {Number} x
   * @param {Number} y
   * @param {Number} radius
   * @param {Object} options
   * @returns {createjs.Shape}
   */
  drawCircle: function(layerName, x, y, radius, options) {
    const circle = new createjs.Shape();

    options = options ? options : {};

    circle.graphics.beginFill(options.fill || '#000000');
    circle.graphics.drawCircle(x, y, radius);

    if (options.alpha) {
      circle.alpha = options.alpha;
    }
    this.getLayer(layerName).addChild(circle);

    this.inputStage.update();

    return circle;
  },

  /**
   * Draws a grid background on the canvas
   * to help users draw proportional characters
   * @method drawGrid
   * @returns {StudyPromptCanvasComponent}
   */
  drawGrid: function() {
    const grid = new createjs.Shape();

    this.clearLayer('character-grid');

    grid.graphics.beginStroke(this.gridColor).setStrokeStyle(this.gridLineWidth, 'round', 'round');
    grid.graphics.dashedLineTo(this.size / 2, 0, this.size / 2, this.size, this.gridDashLength);
    grid.graphics.dashedLineTo(0, this.size / 2, this.size, this.size / 2, this.gridDashLength);
    grid.graphics.dashedLineTo(0, 0, this.size, this.size, this.gridDashLength);
    grid.graphics.dashedLineTo(this.size, 0, 0, this.size, this.gridDashLength);
    grid.graphics.endStroke();
    grid.cache(0, 0, this.size, this.size);

    this.getLayer('character-grid').addChild(grid);

    this.backgroundStage.update();

    return this;
  },

  /**
   * @method drawCharacter
   * @param {String} layerName
   * @param {String} character
   * @param {Object} [options]
   * @returns {createjs.Text}
   */
  drawCharacter: function(layerName, character, options) {
    options = options || {};
    options.color = options.color || '#000000';
    options.font = options.font || 'Arial';

    const size = this.size * 0.75;
    const font = size + 'px ' + options.font;
    const text = new createjs.Text(character, font, options.color);

    // center character on canvas
    text.x = (this.size - size) / 2;
    text.y = (this.size - size) / 1.5;

    this.getLayer(layerName).addChild(text);

    return text;
  },

  /**
   * @method drawShape
   * @param {String} layerName
   * @param {createjs.Container|createjs.Shape} shape
   * @param {Object} [options]
   * @returns {createjs.Shape}
   */
  drawShape: function(layerName, shape, options) {
    options = options || {};

    if (options.color) {
      this.injectColor(shape, options.color);
    }

    this.getLayer(layerName).addChild(shape);

    this.inputStage.update();

    return shape;
  },

  /**
   * @method enableCanvas
   * @returns {Canvas}
   */
  enableCanvas: function() {
    this.inputStage.addEventListener('stagemousedown', _.bind(this.triggerCanvasMouseDown, this));
    this.inputStage.addEventListener('stagemouseup', _.bind(this.triggerCanvasMouseUp, this));
    return this;
  },

  /**
   * @method disableGrid
   * @returns {StudyPromptCanvasComponent}
   */
  enableGrid: function() {
    this.drawGrid();
    this.grid = true;
    return this;
  },

  /**
   * Enables touch and mouse input on the canvas and handles the events.
   * Draws a line to follow the input.
   * @method enableInput
   * @returns {StudyPromptCanvasComponent}
   * @TODO refactor these inner functions and local vars into instance fns
   * and variables--this function does too much!
   */
  enableInput: function() {
    const self = this;
    const strokeSize = this.size * this.brushScale;

    this.disableInput();
    this.downListener = self.inputStage.addEventListener('stagemousedown', onInputDown);

    function onInputDown(event) {
      self.points = [];
      self.marker = new createjs.Shape();
      self.marker.graphics.setStrokeStyle(strokeSize, 'round', 'round');
      self.marker.stroke = self.marker.graphics.beginStroke(self.strokeColor).command;

      self.marker.cache(0, 0, self.size * 2, self.size * 2);
      self.points.push(new createjs.Point(event.stageX, event.stageY));
      self.oldPoint = self.oldMidPoint = self.points[0];
      self.triggerInputDown(self.oldPoint);

      self.getLayer('input').addChild(self.marker);

      self.marker.graphics.moveTo(self.oldPoint.x, self.oldPoint.y);
      self.canvasDirty = true;
      self.inputStage.update();
      self.moveListener = self.inputStage.addEventListener('stagemousemove', self.onInputMove);
      self.upListener = self.inputStage.addEventListener('stagemouseup', onInputUp);
      self.leaveListener = self.inputStage.addEventListener('mouseleave', onInputLeave);
    }

    function onInputLeave(event) {
      onInputUp(event);
    }

    function onInputUp(event) {
      self.inputStage.removeEventListener('stagemousemove', self.onInputMove);
      self.inputStage.removeEventListener('stagemouseup', onInputUp);
      self.inputStage.removeEventListener('mouseleave', onInputLeave);

      self.points.push(new createjs.Point(event.stageX, event.stageY));

      self.marker.graphics.lineTo(event.stageX, event.stageY);
      self.marker.graphics.endStroke();
      self.inputStage.update();

      const clonedMarker = self.marker.clone(true);
      clonedMarker.stroke = self.marker.stroke;
      clonedMarker.cache(0, 0, self.size, self.size);
      self.marker = null;

      self.triggerInputUp(self.points, clonedMarker);
      self.getLayer('input').removeAllChildren();
      self.inputStage.update();

      self.canvasDirty = true;
    }

    return this;
  },

  /**
   * Handles input down movement that draws a line on the canvas
   * @param event
   */
  onInputMove: function(event) {
    const strokeSize = this.size * this.brushScale;

    const point = new createjs.Point(event.stageX, event.stageY);
    const midPoint = new createjs.Point(this.oldPoint.x + point.x >> 1, this.oldPoint.y + point.y >> 1);

    // const canvWidth = 300;
    // const canvHeight = 300;
    // const dx = Math.abs(point.x - (this.oldPoint.x || 1)) / canvWidth;
    // const dy = Math.abs(point.y - (this.oldPoint.y || 1)) / canvHeight;
    // const bestDelta = Math.max(dx, dy);
    // console.log(strokeSize, (bestDelta * 10), (strokeSize - (bestDelta * 10)));
    this.marker.graphics.unstore();
    this.marker.graphics
      .setStrokeStyle(strokeSize, 'round', 'round') //(strokeSize - (bestDelta * 25))
      .moveTo(midPoint.x, midPoint.y)
      .curveTo(this.oldPoint.x, this.oldPoint.y, this.oldMidPoint.x, this.oldMidPoint.y);
    this.oldPoint = point;
    this.oldMidPoint = midPoint;
    this.points.push(point);

    this.marker.updateCache('source-over');
    this.inputStage.update();

    this.canvasDirty = true;
  },

  /**
   * @method fadeLayer
   * @param {String} layerName
   * @param {Object} [options]
   * @param {Function} [callback]
   */
  fadeLayer: function(layerName, options, callback) {
    var layer = this.getLayer(layerName);
    options = options || {};
    options.easing = options.easing || this.defaultFadeEasing;
    options.milliseconds = options.milliseconds || this.defaultFadeSpeed;
    createjs.Tween
      .get(layer).to({alpha: 0}, options.milliseconds, options.easing)
      .call(function() {
        layer.removeAllChildren();
        layer.alpha = 1;
        if (typeof callback === 'function') {
          callback();
        }
      });
  },

  /**
   * @method fadeShape
   * @param {String} layerName
   * @param {createjs.Shape} shape
   * @param {Object} [options]
   * @param {Function} [callback]
   */
  fadeShape: function(layerName, shape, options, callback) {
    const layer = this.getLayer(layerName);
    options = options || {};
    options.easing = options.easing || this.defaultFadeEasing;
    options.milliseconds = options.milliseconds || this.defaultFadeSpeed;
    layer.addChild(shape);
    createjs.Tween
      .get(shape).to({alpha: 0}, options.milliseconds, options.easing)
      .call(function() {
        layer.removeChild(shape);
        shape.alpha = 1;
        if (typeof callback === 'function') {
          callback();
        }
      });
  },

  /**
   * @method getLayer
   * @param {String} name
   * @returns {createjs.Container}
   */
  getLayer: function(name) {
    const stage = _layerMap[name];
    return stage.getChildByName('layer-' + name);
  },

  /**
   * @method injectColor
   * @param {createjs.Container|createjs.Shape} object
   * @param {String} color
   */
  injectColor: function(object, color) {
    var customFill = new createjs.Graphics.Fill(color);
    var customStroke = new createjs.Graphics.Stroke(color);
    (function inject(object) {
      if (object.children) {
        for (var i = 0, length = object.children.length; i < length; i++) {
          inject(object.children[i]);
        }
      } else if (object.graphics) {
        if (object.stroke) {
          object.stroke.style = color;
        } else {
          object.graphics._dirty = true;
          object.graphics._fill = customFill;
          object.graphics._stroke = customStroke;
        }
        if (object.cacheID) {
          object.updateCache('source-over');
        }
      }
    })(object);
    return this;
  },

  /**
   * @method injectLayerColor
   * @param {String} layerName
   * @param {String} color
   * @returns {StudyPromptCanvasComponent}
   */
  injectLayerColor: function(layerName, color) {
    return this.injectColor(this.getLayer(layerName), color);
  },

  /**
   * Performs dirty check logic to determine if the canvas is dirty and needs
   * to be updated on the tick
   */
  onDisplayStageTick: function() {
    this.displayStage.update();
  },

  /**
   * @method remove
   * @returns {StudyPromptCanvasComponent}
   */
  remove: function() {
    $('#fps-counter').remove();
    return GelatoComponent.prototype.remove.call(this);
  },

  /**
   * @method reset
   * @returns {StudyPromptCanvasComponent}
   */
  reset: function() {
    clearTimeout(this.mouseTapTimeout);

    // this.inputStage.children.forEach((layer) => {
    //   layer.removeAllChildren();
    // });

    this.getLayer('character-grid').removeAllChildren();
    this.getLayer('character-hint').removeAllChildren();
    this.getLayer('character-reveal').removeAllChildren();
    this.getLayer('character-teach').removeAllChildren();
    this.getLayer('character').removeAllChildren();
    this.getLayer('stroke-hint').removeAllChildren();
    this.getLayer('input').removeAllChildren();

    this.resize();
    return this;
  },

  /**
   * Resizes the canvas to a perfect square that takes up by default a
   * perfect square 100% of the width of its container, or a smaller/larger
   * defined size, if provided.
   * @param {number} [size] a custom size for the canvas
   * @method resize
   * @returns {StudyPromptCanvasComponent}
   */
  resize: function(size) {
    if (size) {
      this.canvasSizeOverride = size;
    }

    size = this.canvasSizeOverride || this.prompt.getInputSize(size);

    // artificially add a little padding at the bottom if the canvas is about to be
    // set to the same height as its parent container
    const usingHeight = this.prompt.$panelLeft && this.prompt.$panelLeft.height() === size;
    if (usingHeight) {
      size = size - 25;
      this.canvasSizeOverride = size;
    }

    this.$el.height(size);
    this.$el.width(size);
    this.inputStage.canvas.height = size;
    this.inputStage.canvas.width = size;
    this.displayStage.canvas.height = size;
    this.displayStage.canvas.width = size;
    this.backgroundStage.canvas.height = size;
    this.backgroundStage.canvas.width = size;
    this.inputStage.uncache();
    this.inputStage.update();
    this.displayStage.uncache();
    this.displayStage.update();
    this.backgroundStage.uncache();
    this.backgroundStage.update();
    this.size = size;

    if (this.grid) {
      this.drawGrid();
    }

    //TODO: depreciate usage of global canvas size
    app.set('canvasSize', size);

    return this;
  },

  /**
   * @method tracePath
   * @param {String} layerName
   * @param {Array} path
   * @param {Object} [options]
   */
  tracePath: function(layerName, path, options) {
    options = options || {};

    options.fill = options.fill || this.defaultTraceFill;
    var size = this.size;
    var circle = this.drawCircle(layerName, path[0].x, path[0].y, 10, {alpha: 0.6, fill: options.fill});
    var tween = createjs.Tween.get(circle, {loop: true});
    for (var i = 1, length = path.length; i < length; i++) {
      var adjustedPoint = new createjs.Point(path[i].x - path[0].x, path[i].y - path[0].y);
      var throttle = (app.fn.getDistance(path[i], path[i - 1]) / size) * 2000;
      if (path.length < 3) {
        tween.to({x: adjustedPoint.x, y: adjustedPoint.y}, 1000);
      } else {
        tween.to({x: adjustedPoint.x, y: adjustedPoint.y}, throttle);
      }
      if (i === length - 1) {
        tween.wait(1000);
      }
    }
  },

  /**
   * @method triggerCanvasMouseDown
   * @param {Object} event
   */
  triggerCanvasMouseDown: function(event) {
    event.preventDefault();
    this.mouseDownEvent = event;
    this.trigger('mousedown', event);
  },

  /**
   * @method triggerCanvasMouseUp
   * @param {Object} event
   */
  triggerCanvasMouseUp: function(event) {
    event.preventDefault();

    this.mouseLastDownEvent = this.mouseDownEvent;
    this.mouseLastUpEvent = this.mouseUpEvent;
    this.mouseUpEvent = event;
    this.trigger('mouseup', event);

    const linePositionStart = {x: this.mouseDownEvent.stageX, y: this.mouseDownEvent.stageY};
    const linePositionEnd = {x: this.mouseUpEvent.stageX, y: this.mouseUpEvent.stageY};
    const lineAngle = app.fn.getAngle(linePositionStart, linePositionEnd);
    const lineDistance = app.fn.getDistance(linePositionStart, linePositionEnd);
    const lineDuration = this.mouseUpEvent.timeStamp - this.mouseDownEvent.timeStamp;

    if (this.mouseLastUpEvent) {
      const lineLastPositionStart = {x: this.mouseLastDownEvent.stageX, y: this.mouseLastDownEvent.stageY};
      const lineLastPositionEnd = {x: this.mouseLastUpEvent.stageX, y: this.mouseLastUpEvent.stageY};
      const lineLastDistance = app.fn.getDistance(lineLastPositionStart, lineLastPositionEnd);
      const lineLastDuration = this.mouseUpEvent.timeStamp - this.mouseLastUpEvent.timeStamp;

      // be more lenient for touch, less lenient for mouse
      const maxDist = event.nativeEvent.type.indexOf('touch') > -1 ? 20 : 5;

      if (lineLastDistance < maxDist && lineLastDuration > 50 && lineLastDuration < 275) {
        clearTimeout(this.mouseTapTimeout);
        this.trigger('doubletap', event);
        return;
      }
    }

    if (this.mouseDownEvent) {
      if (lineDistance > this.size / 2 && lineAngle < -70 && lineAngle > -110) {
        this.trigger('swipeup', event);
        return;
      }

      if (lineDuration > 1000) {
        this.trigger('clickhold', event);
        return;
      }
    }

    if (this.mouseUpEvent) {
      if (lineDistance < 5 && lineDuration < 1000) {
        this.mouseTapTimeout = setTimeout((function() {
          this.trigger('tap', event);
        }).bind(this), 200);
      }
    }

    this.trigger('click', event);
  },

  /**
   * @method triggerInputDown
   * @param {createjs.Point} point
   */
  triggerInputDown: function(point) {
    this.trigger('input:down', point);
  },

  /**
   * @method triggerInputMove
   * @param {createjs.Point} point
   */
  triggerInputMove: function(point) {
    this.trigger('input:move', point);
  },

  /**
   * @method triggerInputUp
   * @param {Array} points
   * @param {createjs.Shape} shape
   */
  triggerInputUp: function(points, shape) {
    this.trigger('input:up', points, shape);
  },

  /**
   * @method triggerNavigateNext
   * @param {Event} event
   */
  triggerNavigateNext: function(event) {
    event.preventDefault();
    this.trigger('navigate:next');
  },

  /**
   * @method triggerNavigatePrevious
   * @param {Event} event
   */
  triggerNavigatePrevious: function(event) {
    event.preventDefault();
    this.trigger('navigate:previous');
  },

  /**
   * @method tweenShape
   * @param {String} layerName
   * @param {createjs.Shape} fromShape
   * @param {createjs.Shape} toShape
   * @param {Object} [options]
   * @param {Function} [callback]
   * @returns {StudyPromptCanvasComponent}
   */
  tweenShape: function(layerName, fromShape, toShape, options, callback) {
    const bounds = fromShape.getBounds();
    const layer = this.getLayer(layerName);

    options = options === undefined ? {} : options;
    options = options || {};
    options.easing = options.easing || createjs.Ease.backOut;
    options.speed = options.speed || 400;

    fromShape.cache(0, 0, bounds.width, bounds.height);

    layer.addChild(fromShape);

    createjs.Tween
      .get(fromShape)
      .to({
        x: toShape.x,
        y: toShape.y,
        scaleX: toShape.scaleX,
        scaleY: toShape.scaleY
      }, options.speed, options.easing)
      .call(
        function() {
          if (typeof callback === 'function') {
            callback();
          }
        }
      );

    return this;
  }

});

module.exports = StudyPromptCanvasComponent;
