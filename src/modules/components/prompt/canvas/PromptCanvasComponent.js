/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!modules/components/prompt/canvas/prompt-canvas-template.html',
    'core/modules/GelatoComponent'
], function(
    Template, 
    GelatoComponent
) {

    /**
     * @class PromptCanvasComponent
     * @extends GelatoComponent
     */
    var PromptCanvasComponent = GelatoComponent.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(options) {
            options = options || {};
            this.brushScale = 0.04;
            this.defaultFadeEasing = createjs.Ease.sineOut;
            this.defaultFadeSpeed = 500;
            this.grid = true;
            this.gridColor = '#d8dadc';
            this.gridDashLength = 5;
            this.gridLineWidth = 0.75;
            this.prompt = options.prompt;
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
         * @returns {PromptCanvasComponent}
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
            'pointerdown.Canvas canvas': 'triggerCanvasMouseDown',
            'pointerup.Canvas canvas': 'triggerCanvasMouseUp',
            'vmousedown.Canvas canvas': 'triggerCanvasMouseDown',
            'vmouseup.Canvas canvas': 'triggerCanvasMouseUp',
            'vclick #navigate-left': 'triggerNavigateLeft',
            'vclick #navigate-right': 'triggerNavigateRight'
        },
        /**
         * @method clearLayer
         * @param {String} name
         * @returns {PromptCanvasComponent}
         */
        clearLayer: function(name) {
            this.getLayer(name).removeAllChildren();
            this.stage.update();
            return this;
        },
        /**
         * @method clearMessage
         * @returns {PromptCanvasComponent}
         */
        clearMessage: function() {
            this.$('#canvas-message').empty();
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
         * @method disableGrid
         * @returns {PromptCanvasComponent}
         */
        disableGrid: function() {
            this.clearLayer('grid');
            this.grid = false;
            return this;
        },
        /**
         * @method disableInput
         * @returns {PromptCanvasComponent}
         */
        disableInput: function() {
            this.$el.off('.Input');
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
            var circle = new createjs.Shape();
            options = options ? options : {};
            circle.graphics.beginFill(options.fill || '#000000');
            circle.graphics.drawCircle(x, y, radius);
            if (options.alpha) {
                circle.alpha = options.alpha;
            }
            this.getLayer(layerName).addChild(circle);
            this.stage.update();
            return circle;
        },
        /**
         * @method drawGrid
         * @returns {PromptCanvasComponent}
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
         * @method enableGrid
         * @returns {PromptCanvasComponent}
         */
        enableGrid: function() {
            this.drawGrid();
            this.grid = true;
            return this;
        },
        /**
         * @method enableInput
         * @returns {PromptCanvasComponent}
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
                self.triggerInputMove(point);
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
            return this;
        },
        /**
         * @method injectLayerColor
         * @param {String} layerName
         * @param {String} color
         */
        injectLayerColor: function(layerName, color) {
            return this.injectColor(this.getLayer(layerName), color);
        },
        /**
         * @method reset
         * @returns {PromptCanvasComponent}
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
         * @returns {PromptCanvasComponent}
         */
        resize: function(size) {
            app.user.settings.set('canvasSize', size);
            this.stage.canvas.height = size;
            this.stage.canvas.width = size;
            this.size = size;
            if (this.grid) {
                this.drawGrid().reset();
            } else {
                this.reset();
            }
            return this;
        },
        /**
         * @method setMessage
         * @param {String} text
         * @param {Number} [duration]
         * @returns {PromptCanvasComponent}
         */
        setMessage: function(text, duration) {
            this.$('#canvas-message').text(text);
            if (duration) {
                this.$('#canvas-message').fadeOut(duration);
            }
            return this;
        },
        /**
         * @method tracePath
         * @param {String} layerName
         * @param {Array} path
         */
        tracePath: function(layerName, path) {
            var circle = this.drawCircle(layerName, path[0].x, path[0].y, 10, {alpha: 0.6, fill: '#337ab7'});
            var tween = createjs.Tween.get(circle, {loop: true});
            for (var i = 1, length = path.length; i < length; i++) {
                var adjustedX = path[i].x - path[0].x;
                var adjustedY = path[i].y - path[0].y;
                tween.to({x: adjustedX, y: adjustedY}, 1000);
            }
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
         * @method triggerNavigateLeft
         * @param {Event} event
         */
        triggerNavigateLeft: function(event) {
            event.preventDefault();
            this.trigger('navigate:left');
        },
        /**
         * @method triggerNavigateRight
         * @param {Event} event
         */
        triggerNavigateRight: function(event) {
            event.preventDefault();
            this.trigger('navigate:right');
        },
        /**
         * @method tweenShape
         * @param {String} layerName
         * @param {createjs.Shape} fromShape
         * @param {createjs.Shape} toShape
         * @param {Object} [options]
         * @param {Function} [callback]
         * @returns {PromptCanvasComponent}
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

    return PromptCanvasComponent;

});