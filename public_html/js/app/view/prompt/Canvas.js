/**
 * @module Skritter
 * @submodule View
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class PromptCanvas
     */
    var Canvas = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.grid = true;
            Canvas.stage = {};
            Canvas.size = skritter.settings.canvasSize();
            Canvas.gridColor = 'grey';
            Canvas.lastMouseDownEvent = null;
            Canvas.lastMouseUpEvent = null;
            Canvas.strokeSize = 8;
            Canvas.strokeCapStyle = 'round';
            Canvas.strokeColor = '#000000';
            Canvas.strokeJointStyle = 'round';
            Canvas.squigColor = '#000000';
            Canvas.textColor = '#000000';
            Canvas.textFont = 'Arial';
            Canvas.textSize = '12px';
            Canvas.container = this.createCanvasContainer();
            Canvas.stage.display = this.createDisplayStage();
            Canvas.stage.input = this.createInputStage();
            createjs.Ticker.addEventListener('tick', Canvas.stage.display);
            createjs.Touch.enable(Canvas.stage.input);
            createjs.Ticker.setFPS(24);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(Canvas.container);
            this.$(Canvas.container).append(Canvas.stage.display.canvas);
            this.$(Canvas.container).append(Canvas.stage.input.canvas);
            this.$('#canvas-input').on('taphold', _.bind(this.triggerCanvasTapHold, this));
            this.$('#canvas-input').on('vmousedown', _.bind(this.triggerCanvasMouseDown, this));
            this.$('#canvas-input').on('vmouseup', _.bind(this.triggerCanvasMouseUp, this));
            Canvas.stage.display.removeAllChildren();
            Canvas.stage.input.removeAllChildren();
            this.createLayer('background');
            this.createLayer('display');
            this.createLayer('hint');
            this.createLayer('marker');
            this.updateAll();
            if (this.grid)
                this.drawGrid();
            return this;
        },
        /**
         * @method createDisplayCanvas
         * @returns {CreateJS.Stage}
         */
        createDisplayStage: function() {
            var element = document.createElement('canvas');
            element.id = 'canvas-display';
            element.width = Canvas.size;
            element.height = Canvas.size;
            var stage = new createjs.Stage(element);
            stage.autoClear = true;
            stage.enableDOMEvents(false);
            return stage;
        },
        /**
         * @method createCanvasContainer
         * @returns {DOMElement}
         */
        createCanvasContainer: function() {
            var element = document.createElement('div');
            element.className = 'canvas-holder';
            element.style.width = Canvas.size + 'px';
            element.style.height = Canvas.size + 'px';
            return element;
        },
        /**
         * @method createInputStage
         * @returns {CreateJS.Stage}
         */
        createInputStage: function() {
            var element = document.createElement('canvas');
            element.id = 'canvas-input';
            element.width = Canvas.size;
            element.height = Canvas.size;
            var stage = new createjs.Stage(element);
            stage.autoClear = false;
            stage.enableDOMEvents(true);
            return stage;
        },
        /**
         * @method createLayer
         * @param {String} name
         * @returns {Container}
         */
        createLayer: function(name) {
            var layer = new createjs.Container();
            layer.name = 'layer-' + name;
            Canvas.stage.display.addChild(layer);
            return layer;
        },
        /**
         * @method display
         * @returns {CreateJS.Stage}
         */
        display: function() {
            return Canvas.stage.display;
        },
        /**
         * Draws the to the background using a font rather than assembling
         * the character strokes.
         * 
         * @method drawCharacterFromFont
         * @param {String} layerName
         * @param {String} character
         * @param {String} font
         * @param {Number} alpha
         * @param {String} color
         */
        drawCharacterFromFont: function(layerName, character, font, alpha, color) {
            var layer = this.getLayer(layerName);
            color = color ? color : Canvas.textColor;
            font = font ? font : Canvas.textFont;
            var text = new createjs.Text(character, Canvas.size + 'px ' + font, color);
            text.name = character;
            text.alpha = alpha ? alpha : 1;
            layer.addChild(text);
            Canvas.stage.display.update();
        },
        /**
         * @method drawGrid
         * @param {String} color
         */
        drawGrid: function(color) {
            color = color ? color : Canvas.gridColor;
            if (!Canvas.stage.display.getChildByName('grid')) {
                var grid = new createjs.Shape();
                grid.name = 'grid';
                grid.graphics.beginStroke(color).setStrokeStyle(Canvas.gridLineWidth, Canvas.strokeCapStyle, Canvas.strokeJointStyle);
                grid.graphics.moveTo(Canvas.size / 2, 0).lineTo(Canvas.size / 2, Canvas.size);
                grid.graphics.moveTo(0, Canvas.size / 2).lineTo(Canvas.size, Canvas.size / 2);
                grid.graphics.moveTo(0, 0).lineTo(Canvas.size, Canvas.size);
                grid.graphics.moveTo(Canvas.size, 0).lineTo(0, Canvas.size);
                grid.graphics.endStroke();
                Canvas.stage.display.addChildAt(grid, 0);
                Canvas.stage.display.update();
            }
        },
        /**
         * @method disableInput
         * @returns {Backbone.View}
         */
        disableInput: function() {
            this.$('#canvas-input').off('vmousedown.Input');
            this.$('#canvas-input').off('vmousemove.Input');
            this.$('#canvas-input').off('vmouseup.Input');
            return this;
        },
        /**
         * @method drawPoint
         * @param {String} layerName
         * @param {Object} point
         * @returns {CreateJS.Shape}
         */
        drawPoint: function(layerName, point) {
            var circle = new createjs.Shape();
            circle.graphics.beginFill('blue').drawCircle(point.x, point.y, 10);
            this.getLayer(layerName).addChild(circle);
            return circle;
        },
        /**
         * @method drawShape
         * @param {String} layerName
         * @param {CreateJS.Shape} shape
         * @param {Number} alpha
         * @returns {CreateJS.Shape}
         */
        drawShape: function(layerName, shape, alpha) {
            shape.alpha = alpha ? alpha : 1;
            this.getLayer(layerName).addChild(shape);
            Canvas.stage.display.update();
            return shape;
        },
        /**
         * @method enableInput
         */
        enableInput: function() {
            var self = this;
            var stage = Canvas.stage.input;
            var oldPoint, oldMidPoint, points, marker, squig;
            self.$('#canvas-input').on('vmousedown.Input', down);
            function down() {
                points = [];
                marker = new createjs.Shape();
                squig = new createjs.Shape();
                stage.addChild(marker);
                oldPoint = oldMidPoint = new createjs.Point(stage.mouseX, stage.mouseY);
                self.triggerInputDown(oldPoint);
                self.$('#canvas-input').on('vmousemove.Input', move);
                self.$('#canvas-input').on('vmouseup.Input', up);
            }
            function move() {
                var point = new createjs.Point(stage.mouseX, stage.mouseY);
                var midPoint = new createjs.Point(oldPoint.x + point.x >> 1, oldPoint.y + point.y >> 1);
                marker.graphics.clear()
                        .setStrokeStyle(Canvas.strokeSize, Canvas.strokeCapStyle, Canvas.strokeJointStyle)
                        .beginStroke(Canvas.strokeColor)
                        .moveTo(midPoint.x, midPoint.y)
                        .curveTo(oldPoint.x, oldPoint.y, oldMidPoint.x, oldMidPoint.y);
                squig.graphics
                        .setStrokeStyle(Canvas.strokeSize, Canvas.strokeCapStyle, Canvas.strokeJointStyle)
                        .beginStroke(Canvas.strokeColor)
                        .moveTo(midPoint.x, midPoint.y)
                        .curveTo(oldPoint.x, oldPoint.y, oldMidPoint.x, oldMidPoint.y);
                stage.update();
                oldPoint = point;
                oldMidPoint = midPoint;
                points.push(point);
            }
            function up() {
                self.$('#canvas-input').off('vmousemove.Input', move);
                self.$('#canvas-input').off('vmouseup.Input', up);
                self.triggerInputUp(points, squig.clone(true));
                marker.graphics.clear();
                squig.graphics.clear();
                stage.clear();
            }
        },
        /**
         * @method fadeLayer
         * @param {String} layerName
         * @param {Function} callback
         * @returns {Container}
         */
        fadeLayer: function(layerName, callback) {
            var layer = this.getLayer(layerName);
            if (layer.getNumChildren() > 0) {
                layer.cache(0, 0, Canvas.size, Canvas.size);
                createjs.Tween.get(layer).to({alpha: 0}, 500).call(function() {
                    layer.alpha = 1;
                    layer.removeAllChildren();
                    layer.uncache();
                    if (typeof callback === 'function')
                        callback(layer);
                });
            }
            return layer;
        },
        /**
         * @method fadeShape
         * @param {String} layerName
         * @param {CreateJS.Shape} shape
         * @param {Number} milliseconds
         * @param {Function} callback
         */
        fadeShape: function(layerName, shape, milliseconds, callback) {
            var layer = this.getLayer(layerName);
            milliseconds = milliseconds ? milliseconds : 500;
            layer.addChild(shape);
            Canvas.stage.display.update();
            shape.cache(0, 0, Canvas.size, Canvas.size);
            createjs.Tween.get(shape).to({alpha: 0}, milliseconds, createjs.Ease.backOut).call(function() {
                shape.uncache();
                layer.removeChild(shape);
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method getLayer
         * @param {String} name
         * @returns {CreateJS.Container}
         */
        getLayer: function(name) {
            return Canvas.stage.display.getChildByName('layer-' + name);
        },
        /**
         * @method injectLayerColor
         * @param {String} layerName
         * @param {String} color
         */
        injectLayerColor: function(layerName, color) {
            var layer = this.getLayer(layerName);
            var inject = function() {
                if (color)
                    this.fillStyle = color;
            };
            for (var a in layer.children) {
                var child = layer.children[a];
                if (child.children && child.children.length > 0) {
                    for (var b in child.children)
                        if (!child.children[b].children)
                            child.children[b].graphics.inject(inject);
                } else if (!child.children) {
                    child.graphics.inject(inject);
                }
            }
        },
        /**
         * @method remove
         */
        remove: function() {
            createjs.Touch.disable(Canvas.stage.input);
            createjs.Ticker.removeEventListener('tick', Canvas.stage.display);
            this.$('#canvas-display').off();
            this.$('#canvas-input').off();
            Canvas.stage.display.removeAllChildren();
            Canvas.stage.input.removeAllChildren();
            this.$el.empty();
            this.stopListening();
            this.undelegateEvents();
        },
        /**
         * @method size
         * @param {Number} size
         */
        resize: function(size) {
            Canvas.size = size;
            Canvas.container.style.width = size + 'px';
            Canvas.container.style.height = size + 'px';
            Canvas.stage.display.canvas.width = size;
            Canvas.stage.display.canvas.height = size;
            Canvas.stage.input.canvas.width = size;
            Canvas.stage.input.canvas.height = size;
            return this;
        },
        /**
         * @method triggerClick
         * @param {Object} event
         */
        triggerCanvasClick: function(event) {
            this.trigger('canvas:click', event);
        },
        /**
         * @method triggerCanvasDoubleTap
         * @param {Object} event
         */
        triggerCanvasDoubleTap: function(event) {
            this.trigger('canvas:doubletap', event);
        },
        /**
         * @method triggerCanvasMouseDown
         * @param {Object} event
         */
        triggerCanvasMouseDown: function(event) {
            Canvas.lastMouseDownEvent = event;
            this.trigger('canvas:mousedown', event);
        },
        /**
         * @method triggerClick
         * @param {Object} event
         */
        triggerCanvasMouseUp: function(event) {
            Canvas.lastMouseUpEvent = event;
            var mouseDownPosition = {x: Canvas.lastMouseDownEvent.pageX, y: Canvas.lastMouseDownEvent.pageY};
            var mouseUpPosition = {x: Canvas.lastMouseUpEvent.pageX, y: Canvas.lastMouseUpEvent.pageY};
            var mouseDistance = skritter.fn.distance(mouseDownPosition, mouseUpPosition);
            var mouseDuration = Canvas.lastMouseUpEvent.timeStamp - Canvas.lastMouseDownEvent.timeStamp;
            if (mouseDistance <= 10 && mouseDuration > 20 && mouseDuration < 500) {
                this.triggerCanvasClick(event);
            } else {
                this.trigger('canvas:mouseup', event);
            }
        },
        /**
         * @method triggerCanvasTapHold
         * @param {Object} event
         */
        triggerCanvasTapHold: function(event) {
            this.trigger('canvas:taphold', event);
        },
        /**
         * Enables the view to fire events when the canvas has been touched.
         * 
         * @method triggerInputDown
         * @param {Object} point
         */
        triggerInputDown: function(point) {
            this.trigger('input:down', point);
        },
        /**
         * Enables the view to fire events when the canvas touch has been released.
         * 
         * @method triggerInputUp
         * @param {Array} points
         * @param {CreateJS.Shape} shape
         */
        triggerInputUp: function(points, shape) {
            this.trigger('input:up', points, shape);
        },
        /**
         * @method tweenShape
         * @param {String} layerName
         * @param {CreateJS.Shape} fromShape
         * @param {CreateJS.Shape} toShape
         * @param {Number} duration
         * @param {Function} callback
         */
        tweenShape: function(layerName, fromShape, toShape, duration, callback) {
            duration = duration ? duration : 500;
            var layer = this.getLayer(layerName);
            layer.addChildAt(fromShape, 0);
            Canvas.stage.display.update();
            createjs.Tween.get(fromShape).to({
                x: toShape.x,
                y: toShape.y,
                scaleX: toShape.scaleX,
                scaleY: toShape.scaleY,
                rotation: toShape.rotation
            }, duration, createjs.Ease.backOut).call(function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method updateAll
         */
        updateAll: function() {
            Canvas.stage.display.clear();
            Canvas.stage.input.clear();
            Canvas.stage.display.update();
            Canvas.stage.input.update();
        }
    });

    return Canvas;
});