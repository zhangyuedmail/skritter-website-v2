define([
    'require.text!template/prompt-canvas.html'
], function(template) {
    /**
     * @class PromptCanvas
     */
    var Canvas = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.elements = {};
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
            this.textColor = '#000000';
            this.textFont = 'Arial';
            this.textSize = '12px';
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.append(template);
            this.elements.holder = this.$('.canvas-holder')[0];
            this.elements.display = this.$('.canvas-display')[0];
            this.elements.input = this.$('.canvas-input')[0];
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
            createjs.Ticker.setFPS(200);
            this.resize();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
        },
        /**
         * @method clear
         * @returns {Backbone.View}
         */
        clear: function() {
            for (var i = 0, length = this.layerNames.length; i < length; i++) {
                this.getLayer(this.layerNames[i]).removeAllChildren();
            }
            this.resize();
            this.updateAll();
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
         * @method createDisplayStage
         * @returns {CreateJS.Stage}
         */
        createDisplayStage: function() {
            var stage = new createjs.Stage(this.elements.display);
            stage.autoClear = true;
            stage.enableDOMEvents(false);
            return stage;
        },
        /**
         * @method createInputStage
         * @returns {CreateJS.Stage}
         */
        createInputStage: function() {
            var stage = new createjs.Stage(this.elements.input);
            stage.autoClear = false;
            stage.enableDOMEvents(true);
            return stage;
        },
        /**
         * @method createLayer
         * @param {String} name
         * @returns {CreateJS.Container}
         */
        createLayer: function(name) {
            var layer = new createjs.Container();
            layer.name = 'layer-' + name;
            this.stage.display.addChild(layer);
            this.layerNames.push(name);
            return layer;
        },
        /**
         * @method destroy
         */
        destroy: function() {
            var keys = _.keys(this);
            for (var key in keys) {
                this[keys[key]] = undefined;
            }
        },
        /**
         * @method disableGrid
         * @returns {Backbone.View}
         */
        disableGrid: function() {
            this.grid = false;
            this.clearLayer('grid');
            return this;
        },
        /**
         * @method disableInput
         * @returns {Backbone.View}
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
         * @param {CreateJS.Shape} shape
         * @param {Number} color
         * @param {Number} alpha
         * @returns {CreateJS.Shape}
         */
        drawShape: function(layerName, shape, color, alpha) {
            if (alpha) {
                shape.alpha = alpha;
            }
            if (color) {
                if (shape.graphics) {
                    shape.graphics.inject(this.injectColor, color);
                }
                if (shape.children && shape.children.length > 0) {
                    for (var i in shape.children) {
                        shape.children[i].graphics.inject(this.injectColor, color);
                    }
                }
            }
            this.getLayer(layerName).addChild(shape);
            this.stage.display.update();
            return shape;
        },
        /**
         * @method enableGrid
         * @returns {Backbone.View}
         */
        enableGrid: function() {
            this.grid = true;
            this.drawGrid();
            return this;
        },
        /**
         * @method enableInput
         * @returns {Backbone.View}
         */
        enableInput: function() {
            var stage = this.stage.input;
            var oldPoint, oldMidPoint, points, marker, squig;
            this.disableInput().$(this.elements.input).on('vmousedown.Input', _.bind(down, this));
            function down(event) {
                points = [];
                marker = new createjs.Shape();
                squig = new createjs.Shape();
                stage.addChild(marker);
                oldPoint = oldMidPoint = new createjs.Point(stage.mouseX, stage.mouseY);
                this.triggerInputDown(oldPoint, event);
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
                squig.graphics
                        .setStrokeStyle(this.strokeSize, this.strokeCapStyle, this.strokeJointStyle)
                        .beginStroke(this.strokeColor)
                        .moveTo(midPoint.x, midPoint.y)
                        .curveTo(oldPoint.x, oldPoint.y, oldMidPoint.x, oldMidPoint.y);
                stage.update();
                oldPoint = point;
                oldMidPoint = midPoint;
                points.push(point);
            }
            function out(event) {
                this.$(this.elements.input).off('vmousemove.Input');
                this.$(this.elements.input).off('vmouseout.Input');
                this.$(this.elements.input).off('vmouseup.Input');
                this.triggerInputUp(null, squig, event);
                marker.graphics.clear();
                stage.clear();
            }
            function up(event) {
                this.$(this.elements.input).off('vmousemove.Input');
                this.$(this.elements.input).off('vmouseout.Input');
                this.$(this.elements.input).off('vmouseup.Input');
                this.triggerInputUp(points, squig, event);
                marker.graphics.clear();
                stage.clear();
            }
            return this;
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
         * @method fadeShape
         * @param {String} layerName
         * @param {CreateJS.Shape} shape
         * @param {String} color
         * @param {Number} milliseconds
         * @param {Function} callback
         */
        fadeShape: function(layerName, shape, color, milliseconds, callback) {
            var layer = this.getLayer(layerName);
            milliseconds = milliseconds ? milliseconds : 500;
            if (color) {
                if (shape.graphics) {
                    shape.graphics.inject(this.injectColor, color);
                }
                if (shape.children && shape.children.length > 0) {
                    for (var i in shape.children) {
                        shape.children[i].graphics.inject(this.injectColor, color);
                    }
                }
            }
            layer.addChild(shape);
            this.stage.display.update();
            shape.cache(0, 0, this.size, this.size);
            createjs.Tween.get(shape).to({alpha: 0}, milliseconds, createjs.Ease.backOut).call(function() {
                shape.uncache();
                layer.removeChild(shape);
                if (typeof callback === 'function') {
                    callback();
                }
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
         * @method inject
         * @param {String} color
         */
        injectColor: function(color) {
            this.fillStyle = color;
        },
        /**
         * @method injectLayerColor
         * @param {String} layerName
         * @param {String} color
         */
        injectLayerColor: function(layerName, color) {
            var layer = this.getLayer(layerName);
            var inject = function() {
                if (color) {
                    this.fillStyle = color;
                }
            };
            for (var a in layer.children) {
                var child = layer.children[a];
                if (child.children && child.children.length > 0) {
                    for (var b in child.children) {
                        if (!child.children[b].children) {
                            child.children[b].graphics.inject(inject);
                        }
                    }
                } else if (!child.children) {
                    child.graphics.inject(inject);
                }
            }
        },
        /**
         * @method remove
         */
        remove: function() {
            createjs.Ticker.removeEventListener('tick', this.stage.display);
            this.$(this.elements.input).off();
            this.removeElements();
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
            this.destroy();
        },
        /**
         * @method removeElements
         * @returns {Object}
         */
        removeElements: function() {
            for (var i in this.elements) {
                this.elements[i].remove();
                this.elements[i] = undefined;
            }
            return this.elements;
        },
        /**
         * @method resize
         * @param {Number} size
         * @returns {Backbone.View}
         */
        resize: function(size) {
            this.size = size ? size : skritter.settings.getCanvasSize();
            this.elements.holder.style.height = this.size + 'px';
            this.elements.holder.style.width = this.size + 'px';
            this.elements.display.height = this.size;
            this.elements.display.width = this.size;
            this.elements.input.height = this.size;
            this.elements.input.width = this.size;
            if (this.grid) {
                this.drawGrid();
            }
            return this;
        },
        /**
         * @method startSparkling
         */
        startSparkling: function() {
            //TODO: custom animations for pointer sparkling
        },
        /**
         * @method stopSparkling
         */
        stopSparkling: function() {
            //TODO: custom animations for pointer sparkling
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
         * @param {Object} point
         * @param {Object} event
         */
        triggerInputDown: function(point, event) {
            this.trigger('input:down', point, event);
        },
        /**
         * @method triggerInputUp
         * @param {Array} points
         * @param {CreateJS.Shape} shape
         * @param {Object} event
         */
        triggerInputUp: function(points, shape, event) {
            this.trigger('input:up', points, shape, event);
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
                if (typeof callback === 'function') {
                    callback();
                }
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