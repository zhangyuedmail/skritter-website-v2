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
            this.stage = {};
            this.size = skritter.settings.canvasSize();
            this.gridColor = 'grey';
            this.lastMouseDownEvent = null;
            this.lastMouseUpEvent = null;
            this.strokeSize = 8;
            this.strokeCapStyle = 'round';
            this.strokeColor = '#000000';
            this.strokeJointStyle = 'round';
            this.squigColor = '#000000';
            this.textColor = '#000000';
            this.textFont = 'Arial';
            this.textSize = '12px';
            this.container = this.createCanvasContainer();
            this.stage.display = this.createDisplayStage();
            this.stage.input = this.createInputStage();
            createjs.Ticker.addEventListener('tick', this.stage.display);
            createjs.Touch.enable(this.stage.input);
            createjs.Ticker.setFPS(24);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(this.container);
            this.$(this.container).append(this.stage.display.canvas);
            this.$(this.container).append(this.stage.input.canvas);
            this.$('#canvas-input').on('taphold', _.bind(this.triggerCanvasTapHold, this));
            this.$('#canvas-input').on('vmousedown', _.bind(this.triggerCanvasMouseDown, this));
            this.$('#canvas-input').on('vmouseup', _.bind(this.triggerCanvasMouseUp, this));
            this.clear();
            return this;
        },
        /**
         * @method clear
         * @returns {Backbone.View}
         */
        clear: function() {
            this.stage.display.removeAllChildren();
            this.stage.input.removeAllChildren();
            this.createLayer('background');
            this.createLayer('display');
            this.createLayer('teach');
            this.createLayer('hint');
            this.createLayer('marker');
            this.updateAll();
            if (this.grid)
                this.drawGrid();
            return this;
        },
        /**
         * @method clearLayer
         * @param {String} layerName
         * @returns {Backbone.View}
         */
        clearLayer: function(layerName) {
            this.getLayer(layerName).removeAllChildren();
            this.updateAll();
            return this;
        },
        /**
         * @method createDisplayCanvas
         * @returns {CreateJS.Stage}
         */
        createDisplayStage: function() {
            var element = document.createElement('canvas');
            element.id = 'canvas-display';
            element.width = this.size;
            element.height = this.size;
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
            element.style.width = this.size + 'px';
            element.style.height = this.size + 'px';
            return element;
        },
        /**
         * @method createInputStage
         * @returns {CreateJS.Stage}
         */
        createInputStage: function() {
            var element = document.createElement('canvas');
            element.id = 'canvas-input';
            element.width = this.size;
            element.height = this.size;
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
            this.stage.display.addChild(layer);
            return layer;
        },
        /**
         * @method display
         * @returns {CreateJS.Stage}
         */
        display: function() {
            return this.stage.display;
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
            color = color ? color : this.textColor;
            font = font ? font : this.textFont;
            var text = new createjs.Text(character, this.size + 'px ' + font, color);
            text.name = character;
            text.alpha = alpha ? alpha : 1;
            layer.addChild(text);
            this.stage.display.update();
        },
        /**
         * @method drawGrid
         * @param {String} color
         */
        drawGrid: function(color) {
            color = color ? color : this.gridColor;
            if (!this.stage.display.getChildByName('grid')) {
                var grid = new createjs.Shape();
                grid.name = 'grid';
                grid.graphics.beginStroke(color).setStrokeStyle(this.gridLineWidth, this.strokeCapStyle, this.strokeJointStyle);
                grid.graphics.moveTo(this.size / 2, 0).lineTo(this.size / 2, this.size);
                grid.graphics.moveTo(0, this.size / 2).lineTo(this.size, this.size / 2);
                grid.graphics.moveTo(0, 0).lineTo(this.size, this.size);
                grid.graphics.moveTo(this.size, 0).lineTo(0, this.size);
                grid.graphics.endStroke();
                this.stage.display.addChildAt(grid, 0);
                this.stage.display.update();
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
         * @method drawArrow
         * @param {String} layerName
         * @param {Object} point
         * @param {String} color
         * @param {String} borderColor
         * @param {Number} rotation
         * @returns {CreateJS.Shape}
         */
        drawArrow: function(layerName, point, color, borderColor, rotation) {
            borderColor = borderColor ? borderColor : '#000000';
            color = color ? color : '#000000';
            rotation = rotation ? rotation : 0;
            var arrow = new createjs.Shape();
            arrow.graphics.f(color).ss(5).s(borderColor).p("AAUAKIHWHqInWHgIAAvK").cp().ef().es().f(color).ss(5).s(borderColor).p("AH+AKIHWHqInWHgIAAvK").cp().ef().es();
            arrow.setBounds(100, 100);
            arrow.x = point.x;
            arrow.y = point.y;
            arrow.scaleX = 0.3;
            arrow.scaleY = 0.3;
            arrow.regX = 100 / 2;
            arrow.regY = 100 / 2;
            arrow.rotation = rotation;
            this.getLayer(layerName).addChild(arrow);
            return arrow;
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
            this.stage.display.update();
            return shape;
        },
        /**
         * @method enableInput
         */
        enableInput: function() {
            var self = this;
            var stage = this.stage.input;
            var oldPoint, oldMidPoint, points, marker, squig;
            this.disableInput().$('#canvas-input').on('vmousedown.Input', down);
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
                        .setStrokeStyle(self.strokeSize, self.strokeCapStyle, self.strokeJointStyle)
                        .beginStroke(self.strokeColor)
                        .moveTo(midPoint.x, midPoint.y)
                        .curveTo(oldPoint.x, oldPoint.y, oldMidPoint.x, oldMidPoint.y);
                squig.graphics
                        .setStrokeStyle(self.strokeSize, self.strokeCapStyle, self.strokeJointStyle)
                        .beginStroke(self.strokeColor)
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
                layer.cache(0, 0, this.size, this.size);
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
            this.stage.display.update();
            shape.cache(0, 0, this.size, this.size);
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
            return this.stage.display.getChildByName('layer-' + name);
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
            createjs.Touch.disable(this.stage.input);
            createjs.Ticker.removeEventListener('tick', this.stage.display);
            this.$('#canvas-display').off();
            this.$('#canvas-input').off();
            this.stage.display.removeAllChildren();
            this.stage.input.removeAllChildren();
            this.$el.empty();
            this.stopListening();
            this.undelegateEvents();
        },
        /**
         * @method size
         * @param {Number} size
         */
        resize: function(size) {
            this.size = size;
            this.container.style.width = size + 'px';
            this.container.style.height = size + 'px';
            this.stage.display.canvas.width = size;
            this.stage.display.canvas.height = size;
            this.stage.input.canvas.width = size;
            this.stage.input.canvas.height = size;
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
            this.lastMouseDownEvent = event;
            this.trigger('canvas:mousedown', event);
        },
        /**
         * @method triggerClick
         * @param {Object} event
         */
        triggerCanvasMouseUp: function(event) {
            this.lastMouseUpEvent = event;
            var mouseDownPosition = {x: this.lastMouseDownEvent.pageX, y: this.lastMouseDownEvent.pageY};
            var mouseUpPosition = {x: this.lastMouseUpEvent.pageX, y: this.lastMouseUpEvent.pageY};
            var mouseDistance = skritter.fn.distance(mouseDownPosition, mouseUpPosition);
            var mouseDuration = this.lastMouseUpEvent.timeStamp - this.lastMouseDownEvent.timeStamp;
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
            this.stage.display.update();
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
            this.stage.display.clear();
            this.stage.input.clear();
            this.stage.display.update();
            this.stage.input.update();
        }
    });

    return Canvas;
});