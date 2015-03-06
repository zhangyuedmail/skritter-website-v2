/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/writing-canvas.html',
    'core/modules/GelatoView'
], function(Template, GelatoView) {

    /**
     * @class WritingCanvas
     * @extends GelatoView
     */
    var WritingCanvas = GelatoView.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.brushScale = 0.04;
            this.defaultFadeEasing = createjs.Ease.sineOut;
            this.defaultFadeSpeed = 500;
            this.gridColor = '#d8dadc';
            this.gridDashLength = 5;
            this.gridLineWidth = 0.75;
            this.size = 500;
            this.stage = null;
            this.strokeColor = '#5e5d60';
            createjs.Graphics.prototype.dashedLineTo = function(x1, y1, x2, y2, dashLength) {
                this.moveTo(x1 , y1);
                var dX = x2 - x1;
                var dY = y2 - y1;
                var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLength);
                var dashX = dX / dashes;
                var dashY = dY / dashes;
                var i = 0;
                while (i++ < dashes ) {
                    x1 += dashX;
                    y1 += dashY;
                    this[i % 2 === 0 ? 'moveTo' : 'lineTo'](x1, y1);
                }
                this[i % 2 === 0 ? 'moveTo' : 'lineTo'](x2, y2);
                return this;
            };
        },
        /**
         * @method render
         * @param {Number} [size]
         * @returns {WritingCanvas}
         */
        render: function(size) {
            this.$el.html(Template);
            this.stage = this.createStage();
            createjs.Ticker.addEventListener('tick', this.stage);
            createjs.Touch.enable(this.stage);
            createjs.Ticker.setFPS(24);
            this.createLayer('grid');
            this.createLayer('surface-background2');
            this.createLayer('surface-background1');
            this.createLayer('surface');
            this.createLayer('input-background2');
            this.createLayer('input-background1');
            this.createLayer('input');
            this.resize(size || this.size);
            return this;
        },
        /**
         * @property events
         */
        events: {
            'pointerdown.Canvas .writing-canvas': 'triggerCanvasMouseDown',
            'pointerup.Canvas .writing-canvas': 'triggerCanvasMouseUp',
            'vmousedown.Canvas .writing-canvas': 'triggerCanvasMouseDown',
            'vmouseup.Canvas .writing-canvas': 'triggerCanvasMouseUp'
        },
        /**
         * @method clearLayer
         * @param {String} name
         * @returns {WritingCanvas}
         */
        clearLayer: function(name) {
            this.getLayer(name).removeAllChildren();
            this.stage.update();
            return this;
        },
        /**
         * @method createLayer
         * @param {String} name
         * @returns {createjs.Container}
         */
        createLayer: function(name) {
            var layer = new createjs.Container();
            layer.name = 'layer-' + name;
            this.stage.addChild(layer);
            return layer;
        },
        /**
         * @method createStage
         * @returns {createjs.Stage}
         */
        createStage: function() {
            var canvas = this.$('canvas').get(0);
            var stage = new createjs.Stage(canvas);
            stage.autoClear = true;
            stage.enableDOMEvents(true);
            return stage;
        },
        /**
         * @method disableInput
         * @returns {WritingCanvas}
         */
        disableInput: function() {
            this.$el.off('.Input');
            return this;
        },
        /**
         * @method drawGrid
         * @returns {WritingCanvas}
         */
        drawGrid: function() {
            var grid = new createjs.Shape();
            grid.graphics.beginStroke(this.gridColor).setStrokeStyle(this.gridLineWidth, 'round', 'round');
            grid.graphics.dashedLineTo(this.size / 2, 0, this.size / 2, this.size, this.gridDashLength);
            grid.graphics.dashedLineTo(0, this.size / 2, this.size, this.size / 2, this.gridDashLength);
            grid.graphics.dashedLineTo(0, 0, this.size, this.size, this.gridDashLength);
            grid.graphics.dashedLineTo(this.size, 0, 0, this.size, this.gridDashLength);
            grid.graphics.endStroke();
            grid.cache(0, 0, this.size, this.size);
            this.clearLayer('grid').getLayer('grid').addChild(grid);
            this.stage.update();
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
            options.size = options.size || this.size;
            var font = options.size + 'px ' + options.font;
            var text = new createjs.Text(character, font, options.color);
            this.getLayer(layerName).addChild(text);
            this.stage.update();
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
            this.stage.update();
            return shape;
        },
        /**
         * @method enableInput
         * @returns {WritingCanvas}
         */
        enableInput: function() {
            var self = this;
            var oldPoint, oldMidPoint, points, marker;
            this.disableInput().$el.on('vmousedown.Input pointerdown.Input', down);
            function down() {
                points = [];
                marker = new createjs.Shape();
                marker.graphics.setStrokeStyle(self.size * self.brushScale, 'round', 'round').beginStroke(self.strokeColor);
                oldPoint = oldMidPoint = new createjs.Point(self.stage.mouseX, self.stage.mouseY);
                self.triggerInputDown(oldPoint);
                self.getLayer('input').addChild(marker);
                self.$el.on('vmouseout.Input vmouseup.Input pointerup.Input', up);
                self.$el.on('vmousemove.Input pointermove.Input', move);
            }
            function move() {
                var point = new createjs.Point(self.stage.mouseX, self.stage.mouseY);
                var midPoint = new createjs.Point(oldPoint.x + point.x >> 1, oldPoint.y + point.y >> 1);
                marker.graphics.moveTo(midPoint.x, midPoint.y).curveTo(oldPoint.x, oldPoint.y, oldMidPoint.x, oldMidPoint.y);
                oldPoint = point;
                oldMidPoint = midPoint;
                points.push(point);
                self.stage.update();
            }
            function up() {
                marker.graphics.endStroke();
                self.$el.off('vmousemove.Input pointermove.Input', move);
                self.$el.off('vmouseout.Input vmouseup.Input pointerup.Input', up);
                self.triggerInputUp(points, marker.clone(true));
                self.getLayer('input').removeAllChildren();
            }
            return this;
        },
        /**
         * @method fadeShapeOut
         * @param {String} layerName
         * @param {createjs.Shape} shape
         * @param {Object} [options]
         * @param {Function} [callback]
         */
        fadeShape: function(layerName, shape, options, callback) {
            var layer = this.getLayer(layerName);
            options = options || {};
            options.easing = options.easing || this.defaultFadeEasing;
            options.milliseconds = options.milliseconds || this.defaultFadeSpeed;
            layer.addChild(shape);
            createjs.Tween.get(shape).to({alpha: 0}, options.milliseconds, options.easing).call(function() {
                layer.removeChild(shape);
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method getBounds
         * @returns {Object}
         */
        getBounds: function() {
            return {
                height: this.stage.canvas.height,
                width: this.stage.canvas.width
            };
        },
        /**
         * @method getLayer
         * @param {String} name
         * @returns {createjs.Container}
         */
        getLayer: function(name) {
            return this.stage.getChildByName('layer-' + name);
        },
        /**
         * @method getSize
         * @returns {Number}
         */
        getSize: function() {
            return this.size;
        },
        /**
         * @method hide
         * @returns {WritingCanvas}
         */
        hide: function() {
            this.$el.hide();
            return this;
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
                    object.graphics._dirty = true;
                    object.graphics._fill = customFill;
                    object.graphics._stroke = customStroke;
                }
            })(object);
        },
        /**
         * @method reset
         * @returns {WritingCanvas}
         */
        reset: function() {
            this.getLayer('surface-background2').removeAllChildren();
            this.getLayer('surface-background1').removeAllChildren();
            this.getLayer('surface').removeAllChildren();
            this.getLayer('input-background2').removeAllChildren();
            this.getLayer('input-background1').removeAllChildren();
            this.getLayer('input').removeAllChildren();
            this.stage.update();
            return this;
        },
        /**
         * @method resize
         * @param {Number} size
         * @returns {WritingCanvas}
         */
        resize: function(size) {
            app.set('canvasSize', size);
            this.el.style.height = size;
            this.el.style.width = size;
            this.stage.canvas.height = size;
            this.stage.canvas.width = size;
            this.size = size;
            this.reset().drawGrid();
            return this;
        },
        /**
         * @method setLayerColor
         * @param {String} layerName
         * @param {String} color
         * @returns {WritingCanvas}
         */
        setLayerColor: function(layerName, color) {
            this.injectColor(this.getLayer(layerName), color);
            return this;
        },
        /**
         * @method show
         * @returns {WritingCanvas}
         */
        show: function() {
            this.$el.show();
            return this;
        },
        /**
         * @method triggerCanvasMouseDown
         * @param {Object} event
         */
        triggerCanvasMouseDown: function(event) {
            event.preventDefault();
            this.trigger('canvas:click');
        },
        /**
         * @method triggerCanvasMouseUp
         * @param {Object} event
         */
        triggerCanvasMouseUp: function(event) {
            event.preventDefault();
        },
        /**
         * @method triggerInputDown
         * @param {createjs.Point} point
         */
        triggerInputDown: function(point) {
            this.trigger('input:down', point);
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
         * @method tweenShape
         * @param {String} layerName
         * @param {createjs.Shape} fromShape
         * @param {createjs.Shape} toShape
         * @param {Object} [options]
         * @param {Function} [callback]
         * @returns {WritingCanvas}
         */
        tweenShape: function(layerName, fromShape, toShape, options, callback) {
            this.getLayer(layerName).addChild(fromShape);
            options = options === undefined ? {} : options;
            options = options || {};
            options.easing = options.easing || createjs.Ease.quadIn;
            options.speed = options.speed || 200;
            createjs.Tween.get(fromShape).to({
                x: toShape.x,
                y: toShape.y,
                scaleX: toShape.scaleX,
                scaleY: toShape.scaleY
            }, options.speed, options.easing).call(function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
            return this;
        }
    });

    return WritingCanvas;

});