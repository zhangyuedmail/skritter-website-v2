var GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptPartRune
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @param {Object} options
     * @constructor
     */
    initialize: function(options) {
        this.prompt = options.prompt;
        this.listenTo(this.prompt.canvas, 'click', this.handlePromptCanvasClick);
        this.listenTo(this.prompt.canvas, 'tap', this.handlePromptCanvasTap);
        this.listenTo(this.prompt.canvas, 'input:up', this.handlePromptCanvasInputUp);
        this.on('character:complete', this.render);
        this.on('resize', this.render);
    },
    /**
     * @property el
     * @type {String}
     */
    el: '#review-container',
    /**
     * @property events
     * @type Object
     */
    events: {},
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {StudyPromptPartRune}
     */
    render: function() {
        this.renderTemplate();
        this.prompt.review = this.prompt.reviews.current();
        this.prompt.canvas.grid = true;
        this.prompt.canvas.reset();
        this.prompt.vocabDefinition.render();
        this.prompt.vocabReading.render();
        this.prompt.vocabStyle.render();
        this.prompt.vocabWriting.render();
        if (app.user.get('squigs')) {
            this.prompt.canvas.drawShape(
                'character',
                this.prompt.review.character.getUserSquig()
            );
        } else {
            this.prompt.canvas.drawShape(
                'character',
                this.prompt.review.character.getUserShape()
            );
        }
        if (this.prompt.review.isComplete()) {
            this.prompt.canvas.disableInput();
            this.prompt.canvas.injectLayerColor(
                'character',
                this.prompt.review.getGradingColor()
            );
        } else {
            this.prompt.canvas.enableInput();
        }
        return this;
    },
    /**
     * @method handlePromptCanvasClick
     */
    handlePromptCanvasClick: function() {
        if (this.prompt.review.isComplete()) {
            if (this.prompt.reviews.isLast()) {
                this.prompt.trigger('next', this.reviews);
            } else {
                this.prompt.reviews.next();
                this.prompt.trigger('review:next', this.reviews);
                this.render();
            }
        } else {
            this.prompt.canvas.fadeLayer('character-hint');
        }
    },
    /**
     * @method handlePromptCanvasInputUp
     * @param {Array} points
     * @param {createjs.Shape} shape
     */
    handlePromptCanvasInputUp: function(points, shape) {
        if (app.fn.getLength(points) >= 5) {
            var stroke = this.prompt.review.character.recognize(points, shape);
            if (stroke) {
                var targetShape = stroke.getTargetShape();
                var userShape = stroke.getUserShape();
                if (app.user.get('squigs')) {
                    this.prompt.canvas.drawShape(
                        'character',
                        shape
                    );
                } else {
                    stroke.set('tweening', true);
                    this.prompt.canvas.tweenShape(
                        'character',
                        userShape,
                        targetShape
                    );
                }
                this.trigger('attempt:success');
            } else {
                this.trigger('attempt:fail');
            }
            if (this.prompt.review.character.isComplete()) {
                this.prompt.review.set('complete', true);
                this.trigger('character:complete');

            } else {
                this.prompt.review.set('complete', false);
                this.trigger('character:incomplete');
            }
        }
    },
    /**
     * @method handlePromptCanvasTap
     */
    handlePromptCanvasTap: function() {
        var expectedStroke = this.prompt.review.character.getExpectedStroke() ;
        if (expectedStroke) {
            this.prompt.canvas.fadeShape('stroke-hint', expectedStroke.getTargetShape());
        }
    }
});