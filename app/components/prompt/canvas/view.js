var GelatoComponent = require('gelato/component');
var PromptCanvasDefinition = require('components/prompt/canvas-definition/view');
var PromptCanvasReading = require('components/prompt/canvas-reading/view');

/**
 * @class PromptCanvas
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @param {Object} options
     * @constructor
     */
    initialize: function(options) {
        this.brushScale = 0.04;
        this.defaultFadeEasing = createjs.Ease.sineOut;
        this.defaultFadeSpeed = 1000;
        this.defaultTraceFill = '#38240c';
        this.grid = true;
        this.gridColor = '#d8dadc';
        this.gridDashLength = 5;
        this.gridLineWidth = 0.75;
        this.mouseDownEvent = null;
        this.mouseLastDownEvent = null;
        this.mouseLastUpEvent = null;
        this.mouseUpEvent = null;
        this.prompt = options.prompt;
        this.size = 450;
        this.stage = null;
        this.strokeColor = '#4b4b4b';
        this.definition = new PromptCanvasDefinition({prompt: this.prompt});
        this.reading = new PromptCanvasReading({prompt: this.prompt});
        this.on('input:up', this.handleCanvasInputUp);
        this.on('resize', this.resize);
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {PromptCanvas}
     */
    render: function() {
        this.renderTemplate();
        this.definition.setElement('#canvas-definition-container').render();
        this.reading.setElement('#canvas-reading-container').render();
        this.stage = this.createStage();
        this.createLayer('grid');
        this.createLayer('character-hint');
        this.createLayer('character-reveal');
        this.createLayer('character-teach');
        this.createLayer('character');
        this.createLayer('input-background2');
        this.createLayer('input-background1');
        this.createLayer('stroke-hint');
        this.createLayer('input');
        this.resize();
        return this;
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'pointerdown.Canvas canvas': 'triggerCanvasMouseDown',
        'pointerup.Canvas canvas': 'triggerCanvasMouseUp',
        'vmousedown.Canvas canvas': 'triggerCanvasMouseDown',
        'vmouseup.Canvas canvas': 'triggerCanvasMouseUp',
        'vclick #navigate-next': 'triggerNavigateNext',
        'vclick #navigate-previous': 'triggerNavigatePrevious'
    },
    /**
     * @method clearLayer
     * @param {String} name
     * @returns {PromptCanvas}
     */
    clearLayer: function(name) {
        var layer = this.getLayer(name);
        layer.removeAllChildren();
        layer.uncache();
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
        var canvas = this.$('#input-canvas').get(0);
        var stage = new createjs.Stage(canvas);
        createjs.Ticker.removeEventListener('tick', stage);
        createjs.Ticker.addEventListener('tick', stage);
        createjs.Touch.enable(stage);
        createjs.Ticker.setFPS(24);
        stage.autoClear = true;
        stage.enableDOMEvents(true);
        return stage;
    },
    /**
     * @method disableGrid
     * @returns {PromptCanvas}
     */
    disableGrid: function() {
        this.clearLayer('grid');
        this.grid = false;
        return this;
    },
    /**
     * @method disableInput
     * @returns {PromptCanvas}
     */
    disableInput: function() {
        this.$('#input-canvas').off('.Input');
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
     * @returns {PromptCanvas}
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
     * @returns {PromptCanvas}
     */
    enableGrid: function() {
        this.drawGrid();
        this.grid = true;
        return this;
    },
    /**
     * @method enableInput
     * @returns {PromptCanvas}
     */
    enableInput: function() {
        var self = this;
        var oldPoint, oldMidPoint, points, marker;
        this.disableInput().$('#input-canvas').on('vmousedown.Input pointerdown.Input', down);
        function down(event) {
            points = [];
            marker = new createjs.Shape();
            marker.graphics.setStrokeStyle(self.size * self.brushScale, 'round', 'round').beginStroke(self.strokeColor);
            if (event.offsetX && event.offsetY) {
                points.push(new createjs.Point(event.offsetX, event.offsetY));
            } else {
                points.push(new createjs.Point(self.stage.mouseX, self.stage.mouseY));
            }
            oldPoint = oldMidPoint = points[0];
            self.triggerInputDown(oldPoint);
            self.getLayer('input').addChild(marker);
            self.$el.on('vmouseout.Input vmouseup.Input pointerup.Input', up);
            self.$el.on('vmousemove.Input pointermove.Input', move);
        }
        function move(event) {
            var point = new createjs.Point();
            if (event.offsetX && event.offsetY) {
                point.x = event.offsetX;
                point.y = event.offsetY;
            } else {
                point.x = self.stage.mouseX;
                point.y = self.stage.mouseY;
            }
            var midPoint = new createjs.Point(oldPoint.x + point.x >> 1, oldPoint.y + point.y >> 1);
            marker.graphics.moveTo(midPoint.x, midPoint.y).curveTo(oldPoint.x, oldPoint.y, oldMidPoint.x, oldMidPoint.y);
            oldPoint = point;
            oldMidPoint = midPoint;
            points.push(point);
            self.triggerInputMove(point);
            self.stage.update();
        }
        function up(event) {
            marker.graphics.endStroke();
            self.$el.off('vmousemove.Input pointermove.Input', move);
            self.$el.off('vmouseout.Input vmouseup.Input pointerup.Input', up);
            if (event.offsetX && event.offsetY) {
                points.push(new createjs.Point(event.offsetX, event.offsetY));
            } else {
                points.push(new createjs.Point(self.stage.mouseX, self.stage.mouseY));
            }
            self.triggerInputUp(points, marker.clone(true));
            self.getLayer('input').removeAllChildren();
        }
        return this;
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
        createjs.Tween.get(layer).to({alpha: 0}, options.milliseconds, options.easing).call(function() {
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
        var layer = this.getLayer(layerName);
        options = options || {};
        options.easing = options.easing || this.defaultFadeEasing;
        options.milliseconds = options.milliseconds || this.defaultFadeSpeed;
        layer.addChild(shape);
        createjs.Tween.get(shape).to({alpha: 0}, options.milliseconds, options.easing).call(function() {
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
        return this.stage.getChildByName('layer-' + name);
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
     * @returns {PromptCanvas}
     */
    injectLayerColor: function(layerName, color) {
        return this.injectColor(this.getLayer(layerName), color);
    },
    /**
     * @method reset
     * @returns {PromptCanvas}
     */
    reset: function() {
        this.getLayer('character-hint').removeAllChildren();
        this.getLayer('character-reveal').removeAllChildren();
        this.getLayer('character-teach').removeAllChildren();
        this.getLayer('character').removeAllChildren();
        this.getLayer('input-background2').removeAllChildren();
        this.getLayer('input-background1').removeAllChildren();
        this.getLayer('stroke-hint').removeAllChildren();
        this.getLayer('input').removeAllChildren();
        this.stage.update();
        return this;
    },
    /**
     * @method resize
     * @returns {PromptCanvas}
     */
    resize: function() {
        var size = app.getWidth() < 1280 ? this.getWidth() - 50 : 450;
        this.reset().size = size;
        this.stage.canvas.height = size;
        this.stage.canvas.width = size;
        this.$view.height(size);
        this.$view.width(size);
        this.$('#canvas-navigation').css('top', (size / 2) - 35);
        switch (this.prompt.part) {
            case 'rune':
                this.enableGrid();
                break;
            case 'tone':
                this.enableGrid();
                break;
            default:
                this.disableGrid();
        }
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
        this.trigger('mousedown', event);
        this.mouseDownEvent = event;
    },
    /**
     * @method triggerCanvasMouseUp
     * @param {Object} event
     */
    triggerCanvasMouseUp: function(event) {
        event.preventDefault();
        this.trigger('mouseup', event);
        this.mouseLastDownEvent = this.mouseDownEvent;
        this.mouseLastUpEvent = this.mouseUpEvent;
        this.mouseUpEvent = event;
        var linePositionStart = {x: this.mouseDownEvent.pageX, y: this.mouseDownEvent.pageY};
        var linePositionEnd = {x: this.mouseUpEvent.pageX, y: this.mouseUpEvent.pageY};
        var lineAngle = app.fn.getAngle(linePositionStart, linePositionEnd);
        var lineDistance = app.fn.getDistance(linePositionStart, linePositionEnd);
        var lineDuration = this.mouseUpEvent.timeStamp - this.mouseDownEvent.timeStamp;
        if (this.mouseLastUpEvent) {
            var lineLastPositionStart = {x: this.mouseLastDownEvent.pageX, y: this.mouseLastDownEvent.pageY};
            var lineLastPositionEnd = {x: this.mouseLastUpEvent.pageX, y: this.mouseLastUpEvent.pageY};
            var lineLastDistance = app.fn.getDistance(lineLastPositionStart, lineLastPositionEnd);
            var lineLastDuration = this.mouseUpEvent.timeStamp - this.mouseLastUpEvent.timeStamp;
            if (lineLastDistance < 5 && lineLastDuration > 50 && lineLastDuration < 200) {
                this.trigger('doubleclick', event);
                return;
            }
        }
        if (this.mouseDownEvent) {
            if (lineDistance > this.size / 2 && lineAngle < - 70 && lineAngle > -110) {
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
                this.trigger('tap', event);
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
     * @returns {PromptCanvas}
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
    },



    /**
     * @method fadeCharacterHint
     * @returns {PromptCanvas}
     */
    fadeCharacterHint: function() {
        this.fadeLayer('character-hint');
        return this;
    },
    /**
     * @method handleCanvasInputUp
     * @param {Array} points
     * @param {createjs.Shape} shape
     */
    handleCanvasInputUp: function(points, shape) {
        switch (this.prompt.part) {
            case 'rune':
                this.recognizeRune(points, shape);
                break;
            case 'tone':
                this.recognizeTone(points, shape);
                break;
        }
    },
    /**
     * @method hideCharacterHint
     * @returns {PromptCanvas}
     */
    hideCharacterHint: function() {
        this.clearLayer('character-hint');
        return this;
    },
    /**
     * @method hideCharacterReveal
     * @returns {PromptCanvas}
     */
    hideCharacterReveal: function() {
        this.clearLayer('character-reveal');
        return this;
    },
    /**
     * @method hideCharacterHint
     * @returns {PromptCanvas}
     */
    hideStrokeHint: function() {
        this.clearLayer('stroke-hint');
        return this;
    },
    /**
     * @method injectGradingColor
     * @returns {PromptCanvas}
     */
    injectGradingColor: function() {
        this.injectLayerColor('character', this.prompt.review.getGradingColor());
        return this;
    },
    /**
     * @method recognizeRune
     * @param {Array} points
     * @param {createjs.Shape} shape
     */
    recognizeRune: function(points, shape) {
        if (app.fn.getLength(points) >= 5) {
            var review = this.prompt.reviews.current();
            var character = review.character;
            var stroke = character.recognize(points, shape);
            if (stroke) {
                var targetShape = stroke.getTargetShape();
                var userShape = stroke.getUserShape();
                if (app.user.get('squigs')) {
                    this.drawShape(
                        'character',
                        shape
                    );
                } else {
                    stroke.set('tweening', true);
                    this.tweenShape(
                        'character',
                        userShape,
                        targetShape
                    );
                }
                this.trigger('attempt:success');
            } else {
                this.trigger('attempt:fail');
            }
            if (character.isComplete()) {
                this.trigger('complete');
            }
        }
    },
    /**
     * @method recognizeTone
     * @param {Array} points
     * @param {createjs.Shape} shape
     */
    recognizeTone: function(points, shape) {
        var review = this.prompt.reviews.current();
        var character = review.character;
        var stroke = character.recognize(points, shape);
        var possibleTones = review.getTones();
        var expectedTone = character.getTone(possibleTones[0]);
        if (stroke && app.fn.getLength(points) > 30) {
            var targetShape = stroke.getTargetShape();
            var userShape = stroke.getUserShape();
            if (possibleTones.indexOf(stroke.get('tone')) > -1) {
                this.tweenShape('character', userShape, targetShape);
                this.trigger('attempt:success');
            } else {
                character.reset();
                character.add(expectedTone);
                this.drawShape('character', expectedTone.getTargetShape());
                this.trigger('attempt:fail');
            }
        } else {
            character.add(expectedTone);
            if (possibleTones.indexOf(5) > -1) {
                this.drawShape('character', character.getTargetShape());
                this.trigger('attempt:success');
            } else {
                this.drawShape('character', expectedTone.getTargetShape());
                this.trigger('attempt:fail');
            }
        }
        if (character.isComplete()) {
            this.trigger('complete');
        }
    },
    /**
     * @method redrawCharacter
     * @returns {PromptCanvas}
     */
    redrawCharacter: function() {
        this.clearLayer('character');
        if (app.user.get('squigs')) {
            this.drawShape('character', this.prompt.review.character.getUserSquig());
        } else {
            this.drawShape('character', this.prompt.review.character.getUserShape());
        }
        return this;
    },
    /**
     * @method showCharacterHint
     * @returns {PromptCanvas}
     */
    showCharacterHint: function() {
        var review = this.prompt.review;
        var shape = review.character.getTargetShape();
        this.hideCharacterHint();
        switch (this.prompt.reviews.part) {
            case 'rune':
                this.drawShape(
                    'character-hint',
                    shape,
                    {color: '#e8ded2'}
                );
                break;
            case 'tone':
                this.drawCharacter(
                    'character-hint',
                    review.vocab.get('writing'),
                    {color: '#e8ded2', font: review.vocab.getFontName()}
                );
                break;
        }
        return this;
    },
    /**
     * @method review
     * @returns {PromptCanvas}
     */
    showCharacterReveal: function() {
        var review = this.prompt.review;
        var shape = review.character.getTargetShape();
        this.hideCharacterReveal();
        switch (this.prompt.reviews.part) {
            case 'rune':
                this.drawShape(
                    'character-reveal',
                    shape,
                    {color: '#e8ded2'}
                );
                break;
            case 'tone':
                this.drawCharacter(
                    'character-reveal',
                    review.vocab.get('writing'),
                    {color: '#e8ded2', font: review.vocab.getFontName()}
                );
                break;
        }
        return this;
    },
    /**
     * @method showStrokeHint
     * @returns {PromptCanvas}
     */
    showStrokeHint: function() {
        var review = this.prompt.reviews.current();
        if (!review.isComplete()) {
            var shape = review.character.getExpectedStroke().getTargetShape();
            this.fadeShape('stroke-hint', shape);
        }
        return this;
    },
    /**
     * @method startTeaching
     * @returns {PromptCanvas}
     */
    startTeaching: function() {
        var review = this.prompt.reviews.current();
        var shape = review.character.getTargetShape();
        if (review.character && !review.isComplete()) {
            var stroke = review.character.getExpectedStroke();
            if (stroke) {
                this.clearLayer('character-teach');
                this.drawShape('character-teach', shape, {color: '#e8ded2'});
                this.tracePath('character-teach', stroke.getParamPath());
            }
        }
        return this;
    },
    /**
     * @method stopTeaching
     * @returns {PromptCanvas}
     */
    stopTeaching: function() {
        this.clearLayer('character-teach');
        return this;
    }
});