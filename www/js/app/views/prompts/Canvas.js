/**
 * @module Application
 */
define([
    "framework/GelatoView"
], function(GelatoView) {
    return GelatoView.extend({
        /**
         * @class PromptCanvas
         */
        initialize: function() {
            this.size = undefined;
            this.stage = undefined;
        },
        /**
         * @property el
         * @type String
         */
        el: ".canvas-container",
        /**
         * @method render
         * @returns {PromptCanvas}
         */
        render: function() {
            this.stage = this.createStage();
            this.$el.html(this.stage.canvas);
            createjs.Ticker.addEventListener("tick", this.stage);
            createjs.Touch.enable(this.stage);
            createjs.Ticker.setFPS(24);
            this.createLayer("grid");
            this.createLayer("background");
            this.createLayer("input");
            this.resize();
            this.drawGrid();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, GelatoView.prototype.events, {
            });
        },
        /**
         * @method clearLayer
         * @param {String} layerName
         * @returns {PromptCanvas}
         */
        clearLayer: function(layerName) {
            this.getLayer(layerName).removeAllChildren();
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
            layer.name = "layer-" + name;
            this.stage.addChild(layer);
            return layer;
        },
        /**
         * @method createStage
         * @returns {createjs.Stage}
         */
        createStage: function() {
            var canvas = document.createElement("canvas");
            var stage = new createjs.Stage(canvas);
            canvas.id = "prompt-canvas";
            stage.autoClear = true;
            stage.enableDOMEvents(true);
            return stage;
        },
        /**
         * @method disableInput
         * @returns {PromptCanvas}
         */
        disableInput: function() {
            this.$el.off(".Input");
            return this;
        },
        /**
         * @method drawGrid
         * @param {Object} options
         */
        drawGrid: function(options) {
            var grid = new createjs.Shape();
            this.clearLayer('grid');
            options = options ? options : {};
            options.gridLineWidth= options.gridLineWidth ? options.gridLineWidth : "round";
            options.strokeJointStyle= options.strokeJointStyle ? options.strokeJointStyle : "round";
            options.color= options.color ? options.color : "#d3d3d3";
            grid.graphics.beginStroke(options.color).setStrokeStyle(this.gridLineWidth, options.strokeCapStyle, options.strokeJointStyle);
            grid.graphics.moveTo(this.size / 2, 0).lineTo(this.size / 2, this.size);
            grid.graphics.moveTo(0, this.size / 2).lineTo(this.size, this.size / 2);
            grid.graphics.moveTo(0, 0).lineTo(this.size, this.size);
            grid.graphics.moveTo(this.size, 0).lineTo(0, this.size);
            grid.graphics.endStroke();
            grid.cache(0, 0, this.size, this.size);
            this.getLayer("grid").addChild(grid);
            this.stage.update();
        },
        /**
         * @method drawShape
         * @param {String} layerName
         * @param {createjs.Shape} shape
         * @param {Object} options
         * @returns {PromptCanvas}
         */
        drawShape: function(layerName, shape, options) {
            options = options ? options : {};
            options.alpha= options.alpha ? options.alpha : undefined;
            options.color= options.color ? options.color : undefined;
            if (options.alpha) {
                shape.alpha = options.alpha;
            }
            if (options.color) {
                this.injectColor(shape, options.color);
            }
            this.getLayer(layerName).addChild(shape);
            this.stage.update();
            return this;
        },
        /**
         * @method enableInput
         * @returns {PromptCanvas}
         */
        enableInput: function() {
            var self = this;
            var oldPoint, oldMidPoint, points, marker;
            this.disableInput();
            this.$el.on("vmousedown.Input", down);
            this.$el.on("vmouseup.Input", up);
            function down() {
                points = [];
                marker = new createjs.Shape();
                marker.graphics.setStrokeStyle(12, "round", "round").beginStroke("#000000");
                oldPoint = oldMidPoint = new createjs.Point(self.stage.mouseX, self.stage.mouseY);
                self.getLayer("input").addChild(marker);
                self.$el.on("vmouseout.Input", up);
                self.$el.on("vmousemove.Input", move);
            }
            function move() {
                var point = new createjs.Point(self.stage.mouseX, self.stage.mouseY);
                var midPoint = {x: oldPoint.x + point.x >> 1, y: oldPoint.y + point.y >> 1};
                marker.graphics.moveTo(midPoint.x, midPoint.y).curveTo(oldPoint.x, oldPoint.y, oldMidPoint.x, oldMidPoint.y);
                oldPoint = point;
                oldMidPoint = midPoint;
                points.push(point);
                self.stage.update();
            }
            function up() {
                marker.graphics.endStroke();
                self.$el.off("vmouseout.Input", up);
                self.$el.off("vmousemove.Input", move);
                self.fadeShape("background", marker.clone(true));
                self.getLayer("input").removeAllChildren();
            }
        },
        /**
         * @method fadeShapeOut
         * @param {String} layerName
         * @param {createjs.Shape} shape
         * @param {Object} options
         * @param {Function} callback
         */
        fadeShape: function(layerName, shape, options, callback) {
            var layer = this.getLayer(layerName);
            options = options ? options : {};
            options.alpha = options.alpha ? options.alpha : undefined;
            options.color = options.color ? options.color : undefined;
            options.milliseconds = options.milliseconds ? options.milliseconds : 500;
            if (options.alpha) {
                shape.alpha = options.alpha;
            }
            if (options.color) {
                this.injectColor(shape, options.color);
            }
            layer.addChild(shape);
            createjs.Tween.get(shape).to({alpha: 0}, options.milliseconds, createjs.Ease.sineOut).call(function() {
                layer.removeChild(shape);
                if (typeof callback === "function") {
                    callback();
                }
            });
        },
        /**
         * @method getLayer
         * @param {String} layerName
         * @returns {createjs.Container}
         */
        getLayer: function(layerName) {
            return this.stage.getChildByName("layer-" + layerName);
        },
        /**
         * @method injectColor
         * @param {createjs.Container|createjs.Shape} object
         * @param {String} color
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
                    object.graphics._dirty = true;
                    object.graphics._fill = customFill;
                    object.graphics._stroke = customStroke;
                }
            }
            inject(object);
        },
        /**
         * @method resize
         * @returns {PromptCanvas}
         */
        resize: function(size) {
            size = size ? size : this.$el.width();
            this.el.style.height = size + "px";
            this.el.style.width = size + "px";
            this.stage.canvas.height = size;
            this.stage.canvas.width = size;
            this.size = size;
            return this;
        }
    });
});