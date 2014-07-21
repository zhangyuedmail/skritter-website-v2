define([
    'require.text!template/prompt-canvas.html',
    'view/View'
], function(template, View) {
    /**
     * @class PromptCanvas
     */
    var PromptCanvas = View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            View.prototype.initialize.call(this);
            this.grid = true;
            this.gridColor = '#666666';
            this.lastMouseDownEvent = null;
            this.layerNames = [];
            this.mouseDownEvent = null;
            this.mouseDownTimer = null;
            this.mouseMoveEvent = null;
            this.mouseUpEvent = null;
            this.size = 600;
            this.stage = {};
            this.strokeSize = 8;
            this.strokeCapStyle = 'round';
            this.strokeColor = '#000000';
            this.strokeJointStyle = 'round';
        },
        /**
         * @method render
         * @returns {PromptCanvas}
         */
        render: function() {
            this.$el.html(template);
            this.loadElements();
            this.stage.display = this.createDisplayStage();
            this.stage.input = this.createInputStage();
            this.createLayer('grid');
            this.createLayer('background');
            this.createLayer('hint');
            this.createLayer('stroke');
            this.$(this.elements.input).on('vmousedown.Canvas', _.bind(this.triggerCanvasMouseDown, this));
            this.$(this.elements.input).on('vmouseup.Canvas', _.bind(this.triggerCanvasMouseUp, this));
            createjs.Ticker.addEventListener('tick', this.stage.display);
            createjs.Touch.enable(this.stage.input);
            createjs.Ticker.setFPS(24);
            this.resize();
            return this;
        },
        /**
         * @method loadElements
         * @returns {PromptCanvas}
         */
        loadElements: function() {
            this.elements.holder = this.$('.canvas-holder');
            this.elements.display = this.$('.canvas-display');
            this.elements.input = this.$('.canvas-input');
            return this;
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, View.prototype.events, {
            });
        },
        /**
         * @method clear
         * @returns {PromptCanvas}
         */
        clear: function() {
            for (var i = 0, length = this.layerNames.length; i < length; i++) {
                this.getLayer(this.layerNames[i]).removeAllChildren();
            }
            this.stage.input.removeAllChildren();
            this.updateAll();
            this.resize();
            return this;
        },
        /**
         * @method clearLayer
         * @param {String} layerName
         * @returns {PromptCanvas}
         */
        clearLayer: function(layerName) {
            this.getLayer(layerName).removeAllChildren();
            this.updateAll();
            return this;
        },
        /**
         * @method createDisplayStage
         * @returns {createjs.Stage}
         */
        createDisplayStage: function() {
            var stage = new createjs.Stage(this.elements.display[0]);
            stage.autoClear = true;
            stage.enableDOMEvents(false);
            return stage;
        },
        /**
         * @method createInputStage
         * @returns {createjs.Stage}
         */
        createInputStage: function() {
            var stage = new createjs.Stage(this.elements.input[0]);
            stage.autoClear = false;
            stage.enableDOMEvents(true);
            return stage;
        },
        /**
         * @method createLayer
         * @param {String} name
         * @returns {createjs.Container}
         */
        createLayer: function(name) {
            var layer = new createjs.Container();
            layer.name = 'layer-' + name;
            this.stage.display.addChild(layer);
            this.layerNames.push(name);
            return layer;
        },
        /**
         * @method disableGrid
         * @returns {PromptCanvas}
         */
        disableGrid: function() {
            this.grid = false;
            this.clearLayer('grid');
            return this;
        },
        /**
         * @method disableInput
         * @returns {PromptCanvas}
         */
        disableInput: function() {
            this.$(this.elements.input).off('vmousedown.Input');
            this.$(this.elements.input).off('vmousemove.Input');
            this.$(this.elements.input).off('vmouseout.Input');
            this.$(this.elements.input).off('vmouseup.Input');
            return this;
        },
        /**
         * @method drawCharacterFromFont
         * @param {String} layerName
         * @param {String} character
         * @param {String} font
         * @param {String} color
         * @param {Number} alpha
         */
        drawCharacterFromFont: function(layerName, character, font, color, alpha) {
            var layer = this.getLayer(layerName);
            var text = new createjs.Text(character, this.size + 'px ' + font, color);
            if (alpha) {
                text.alpha = alpha;
            }
            layer.addChild(text);
            this.stage.display.update();
        },
        /**
         * @method drawGrid
         * @param {String} color
         */
        drawGrid: function(color) {
            this.clearLayer('grid');
            var grid = new createjs.Shape();
            color = color ? color : this.gridColor;
            grid.graphics.beginStroke(color).setStrokeStyle(this.gridLineWidth, this.strokeCapStyle, this.strokeJointStyle);
            grid.graphics.moveTo(this.size / 2, 0).lineTo(this.size / 2, this.size);
            grid.graphics.moveTo(0, this.size / 2).lineTo(this.size, this.size / 2);
            grid.graphics.moveTo(0, 0).lineTo(this.size, this.size);
            grid.graphics.moveTo(this.size, 0).lineTo(0, this.size);
            grid.graphics.endStroke();
            this.getLayer('grid').addChild(grid);
            this.stage.display.update();
        },
        /**
         * @method drawShape
         * @param {String} layerName
         * @param {createjs.Shape} shape
         * @param {String} color
         * @param {Number} alpha
         * @returns {PromptCanvas}
         */
        drawShape: function(layerName, shape, color, alpha) {
            if (alpha) {
                shape.alpha = alpha;
            }
            if (color) {
                this.injectColor(shape, color);
            }
            this.getLayer(layerName).addChild(shape);
            this.stage.display.update();
            return this;
        },
        /**
         * @method enableGrid
         * @returns {PromptCanvas}
         */
        enableGrid: function() {
            this.grid = true;
            this.drawGrid();
            return this;
        },
        /**
         * @method enableInput
         * @returns {PromptCanvas}
         */
        enableInput: function() {
            var stage = this.stage.input;
            var oldPoint, oldMidPoint, points, marker, squig;
            this.disableInput().$(this.elements.input).on('vmousedown.Input', _.bind(down, this));
            function down(event) {
                points = [];
                marker = new createjs.Shape();
                squig = new createjs.Shape();
                squig.graphics.setStrokeStyle(this.strokeSize, this.strokeCapStyle, this.strokeJointStyle).beginStroke(this.strokeColor);
                stage.addChild(marker);
                oldPoint = oldMidPoint = new createjs.Point(stage.mouseX, stage.mouseY);
                this.triggerInputDown(event, oldPoint);
                this.$(this.elements.input).on('vmousemove.Input', _.bind(move, this));
                this.$(this.elements.input).on('vmouseout.Input', _.bind(out, this));
                this.$(this.elements.input).on('vmouseup.Input', _.bind(up, this));
            }
            function move() {
                var point = {x: stage.mouseX, y: stage.mouseY};
                var midPoint = {x: oldPoint.x + point.x >> 1, y: oldPoint.y + point.y >> 1};
                marker.graphics.clear()
                    .setStrokeStyle(this.strokeSize, this.strokeCapStyle, this.strokeJointStyle)
                    .beginStroke(this.strokeColor)
                    .moveTo(midPoint.x, midPoint.y)
                    .curveTo(oldPoint.x, oldPoint.y, oldMidPoint.x, oldMidPoint.y);
                squig.graphics.moveTo(midPoint.x, midPoint.y).curveTo(oldPoint.x, oldPoint.y, oldMidPoint.x, oldMidPoint.y);
                stage.update();
                oldPoint = point;
                oldMidPoint = midPoint;
                points.push(point);
            }
            function out(event) {
                this.$(this.elements.input).off('vmousemove.Input');
                this.$(this.elements.input).off('vmouseout.Input');
                this.$(this.elements.input).off('vmouseup.Input');
                this.triggerInputUp(event, null, squig.clone(true));
                marker.graphics.clear();
                stage.clear();
            }
            function up(event) {
                this.$(this.elements.input).off('vmousemove.Input');
                this.$(this.elements.input).off('vmouseout.Input');
                this.$(this.elements.input).off('vmouseup.Input');
                this.triggerInputUp(event, points, squig.clone(true));
                marker.graphics.clear();
                stage.clear();
            }
            return this;
        },
        /**
         * @method disableTicker
         * @returns {PromptCanvas}
         */
        disableTicker: function() {
            createjs.Ticker.setPaused(true);
            return this;
        },
        /**
         * @method enableTicker
         * @returns {PromptCanvas}
         */
        enableTicker: function() {
            createjs.Ticker.setPaused(false);
            return this;
        },
        /**
         * @method fadeLayer
         * @param {String} layerName
         * @param {Function} callback
         * @returns {createjs.Container}
         */
        fadeLayer: function(layerName, callback) {
            var layer = this.getLayer(layerName);
            if (layer.getNumChildren() > 0) {
                layer.cache(0, 0, this.size, this.size);
                createjs.Tween.get(layer).to({alpha: 0}, 300).call(function() {
                    layer.removeAllChildren();
                    layer.uncache();
                    layer.alpha = 1;
                    if (typeof callback === 'function') {
                        callback(layer);
                    }
                });
            }
            return layer;
        },
        /**
         * @method fadeShapeOut
         * @param {String} layerName
         * @param {createjs.Shape} shape
         * @param {String} color
         * @param {Number} milliseconds
         * @param {Function} callback
         */
        fadeShape: function(layerName, shape, color, milliseconds, callback) {
            var layer = this.getLayer(layerName);
            milliseconds = milliseconds ? milliseconds : 500;
            if (color) {
                this.injectColor(shape, color);
            }
            layer.addChild(shape);
            this.stage.display.update();
            createjs.Tween.get(shape).to({alpha: 0}, milliseconds, createjs.Ease.sineOut).call(function() {
                layer.removeChild(shape);
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method injectColor
         * @param {createjs.Container|createjs.Shape} object
         * @param {String} string
         */
        injectColor: function(object, color) {
            var customFill = new createjs.Graphics.Fill(color);
            var customStroke = new createjs.Graphics.Stroke(color);
            function inject(object) {
                if (object.children) {
                    for (var i = 0, length = object.children.length; i < length; i++) {
                        inject(object.children[i]);
                    }
                } else if (object.graphics) {
                    object.graphics._fill = customFill;
                    object.graphics._stroke = customStroke;
                }
            }
            inject(object);
        },
        /**
         * @method injectLayer
         * @param {String} layerName
         * @param color
         */
        injectLayerColor: function(layerName, color) {
            this.injectColor(this.getLayer(layerName), color);
        },
        /**
         * @method getLayer
         * @param {String} name
         * @returns {createjs.Container}
         */
        getLayer: function(name) {
            return this.stage.display.getChildByName('layer-' + name);
        },
        /**
         * @method hide
         * @param {Function} callback
         * @returns {PromptCanvas}
         */
        hide: function(callback) {
            this.$el.hide(0, callback);
            return this;
        },
        /**
         * @method remove
         */
        remove: function() {
            this.$(this.elements.input).off();
            View.prototype.remove.call(this);
        },
        /**
         * @method resize
         * @param {Number} size
         * @returns {PromptCanvas}
         */
        resize: function(size) {
            this.size = size ? size : skritter.settings.getCanvasSize();
            this.elements.holder[0].style.height = this.size + 'px';
            this.elements.holder[0].style.width = this.size + 'px';
            this.elements.display[0].height = this.size;
            this.elements.display[0].width = this.size;
            this.elements.input[0].height = this.size;
            this.elements.input[0].width = this.size;
            if (this.grid) {
                this.drawGrid();
            }
            return this;
        },
        /**
         * @method show
         * @param {Function} callback
         * @returns {PromptCanvas}
         */
        show: function(callback) {
            this.$el.show(0, callback);
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
         * @method triggerCanvasClickHold
         * @param {Object} event
         */
        triggerCanvasClickHold: function(event) {
            this.trigger('canvas:clickhold', event);
        },
        /**
         * @method triggerCanvasDoubleClick
         * @param {Object} event
         */
        triggerCanvasDoubleClick: function(event) {
            this.trigger('canvas:doubleclick', event);
        },
        /**
         * @method triggerCanvasMouseDown
         * @param {Object} event
         */
        triggerCanvasMouseDown: function(event) {
            this.mouseDownEvent = event;
            this.trigger('canvas:mousedown', event);
            if (this.lastMouseDownEvent) {
                var elapsed = this.mouseDownEvent.timeStamp - this.lastMouseDownEvent.timeStamp;
                if (elapsed > 20 && elapsed < 400) {
                    var lastPostion = {x: this.lastMouseDownEvent.pageX, y: this.lastMouseDownEvent.pageY};
                    var currentPosition = {x: this.mouseDownEvent.pageX, y: this.mouseDownEvent.pageY};
                    if (skritter.fn.getDistance(lastPostion, currentPosition) <= 10) {
                        this.triggerCanvasDoubleClick(event);
                    }
                }
            }
            this.$(this.elements.input).on('vmousemove.Canvas', _.bind(function(event) {
                this.mouseMoveEvent = event;
            }, this));
            this.mouseDownTimer = window.setTimeout(_.bind(function() {
                var distance = 0;
                if (this.mouseMoveEvent) {
                    var startPosition = {x: this.mouseDownEvent.pageX, y: this.mouseDownEvent.pageY};
                    var endPosition = {x: this.mouseMoveEvent.pageX, y: this.mouseMoveEvent.pageY};
                    distance = skritter.fn.getDistance(startPosition, endPosition);
                }
                if (distance <= 10) {
                    this.triggerCanvasClickHold(event);
                }
            }, this), 1000);
        },
        /**
         * @method triggerClick
         * @param {Object} event
         */
        triggerCanvasMouseUp: function(event) {
            window.clearTimeout(this.mouseDownTimer);
            this.$(this.elements.input).off('vmousemove.Canvas');
            this.lastMouseDownEvent = this.mouseDownEvent;
            this.mouseMoveEvent = null;
            this.mouseUpEvent = event;
            if (this.mouseDownEvent) {
                var startPosition = {x: this.mouseDownEvent.pageX, y: this.mouseDownEvent.pageY};
                var endPosition = {x: this.mouseUpEvent.pageX, y: this.mouseUpEvent.pageY};
                var angle = skritter.fn.getAngle(startPosition, endPosition);
                var distance = skritter.fn.getDistance(startPosition, endPosition);
                var duration = this.mouseUpEvent.timeStamp - this.mouseDownEvent.timeStamp;
                if (distance <= 10 && (duration > 20 && duration < 400)) {
                    this.triggerCanvasClick(event);
                } else if (distance > 100 && angle < -70 && angle > -110) {
                    this.triggerSwipeUp(event);
                } else {
                    this.trigger('canvas:mouseup', event);
                }
            }
        },
        /**
         * @method triggerInputDown
         * @param {Object} event
         * @param {Object} point
         */
        triggerInputDown: function(event, point) {
            this.trigger('input:down', event, point);
        },
        /**
         * @method triggerInputUp
         * @param {Object} event
         * @param {Array} points
         * @param {createjs.Shape} shape
         */
        triggerInputUp: function(event, points, shape) {
            this.trigger('input:up', event, points, shape);
        },
        /**
         * @method triggerSwipeUp
         * @param {Object} event
         */
        triggerSwipeUp: function(event) {
            this.trigger('canvas:swipeup', event);
        },
        /**
         * @method tweenShape
         * @param {String} layerName
         * @param {CreateJS.Shape} fromShape
         * @param {CreateJS.Shape} toShape
         * @param {Function} callback
         */
        tweenShape: function(layerName, fromShape, toShape, callback) {
            var layer = this.getLayer(layerName);
            layer.addChild(fromShape);
            this.stage.display.update();
            createjs.Tween.get(fromShape).to({
                x: toShape.x,
                y: toShape.y,
                scaleX: toShape.scaleX,
                scaleY: toShape.scaleY,
                rotation: toShape.rotation
            }, 300, createjs.Ease.backOut).call(function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method tweenCharacter
         * @param {String} layerName
         * @param {Backbone.Collection} character
         * @param {Function} callback
         */
        tweenCharacter: function(layerName, character, callback) {
            var position = 0;
            for (var i = 0, length = character.length; i < length; i++) {
                var stroke = character.at(i);
                this.tweenShape(layerName, stroke.getUserShape(), stroke.inflateShape(), function() {
                    position++;
                    if (position >= character.length) {
                        if (typeof callback === 'function') {
                            callback();
                        }
                    }
                });
            }
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

    return PromptCanvas;
});