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
        this.listenTo(this.prompt.canvas, 'doubletap', this.handlePromptDoubleTap);
        this.listenTo(this.prompt.canvas, 'swipeup', this.handlePromptCanvasSwipeUp);
        this.listenTo(this.prompt.canvas, 'tap', this.handlePromptCanvasTap);
        this.listenTo(this.prompt.canvas, 'input:up', this.handlePromptCanvasInputUp);
        this.listenTo(this.prompt.toolbarGrading, 'mousedown', this.handlePromptToolbarGradingMousedown);
        this.on('attempt:fail', this.handleAttemptFail);
        this.on('attempt:success', this.handleAttemptSuccess);
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
        this.prompt.shortcuts.tone.stop_listening();
        this.prompt.toolbarAction.buttonCorrect = true;
        this.prompt.toolbarAction.buttonErase = true;
        this.prompt.toolbarAction.buttonShow = true;
        this.prompt.toolbarAction.buttonTeach = true;
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
            this.renderComplete();
        } else {
            this.renderIncomplete();
        }
        return this;
    },
    /**
     * @method renderComplete
     * @returns {StudyPromptPartRune}
     */
    renderComplete: function() {
        this.prompt.review.stop();
        this.prompt.review.set('complete', true);
        this.prompt.canvas.disableInput();
        this.prompt.canvas.injectLayerColor(
            'character',
            this.prompt.review.getGradingColor()
        );
        this.prompt.shortcuts.grading.listen();
        this.prompt.toolbarAction.render();
        this.prompt.toolbarGrading.render();
        this.prompt.toolbarGrading.select(this.prompt.review.get('score'));
        this.prompt.toolbarVocab.render();
        this.prompt.vocabContained.render();
        this.prompt.vocabDefinition.render();
        this.prompt.vocabMnemonic.render();
        this.prompt.vocabReading.render();
        this.prompt.vocabSentence.render();
        this.prompt.vocabStyle.render();
        this.prompt.vocabWriting.render();
        return this;
    },
    /**
     * @method renderIncomplete
     * @returns {StudyPromptPartRune}
     */
    renderIncomplete: function() {
        this.prompt.review.start();
        this.prompt.review.set('complete', false);
        this.prompt.canvas.enableInput();
        this.prompt.shortcuts.grading.stop_listening();
        this.prompt.toolbarAction.render();
        this.prompt.toolbarGrading.render();
        this.prompt.toolbarVocab.render();
        this.prompt.vocabContained.render();
        this.prompt.vocabDefinition.render();
        this.prompt.vocabMnemonic.render();
        this.prompt.vocabReading.render();
        this.prompt.vocabSentence.render();
        this.prompt.vocabStyle.render();
        this.prompt.vocabWriting.render();
        return this;
    },
    /**
     * @method handleAttemptFail
     */
    handleAttemptFail: function() {
        var character = this.prompt.review.character;
        var failedConsecutive = this.prompt.review.get('failedConsecutive') + 1;
        var failedTotal = this.prompt.review.get('failedTotal') + 1;
        this.prompt.review.set('failedConsecutive', failedConsecutive);
        this.prompt.review.set('failedTotal', failedTotal);
        if (character.getMaxPosition() > 4) {
            if (this.prompt.review.get('failedTotal') > 3) {
                this.prompt.review.set('score', 1);
            } else if (this.prompt.review.get('failedTotal') > 2) {
                this.prompt.review.set('score', 2);
            }
        } else {
            if (this.prompt.review.get('failedTotal') > 1) {
                this.prompt.review.set('score', 1);
            }
        }
        if (failedConsecutive > 2) {
            var expectedStroke = this.prompt.review.character.getExpectedStroke();
            if (expectedStroke) {
                this.prompt.canvas.fadeShape('stroke-hint', expectedStroke.getTargetShape());
            }
        }
    },
    /**
     * @method handleAttemptSuccess
     */
    handleAttemptSuccess: function() {
        this.prompt.review.set('failedConsecutive', 0);
    },
    /**
     * @method handlePromptCanvasClick
     */
    handlePromptCanvasClick: function() {
        if (this.prompt.review.isComplete()) {
            this.prompt.next();
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
                this.renderComplete();
            } else {
                this.renderIncomplete();
            }
        }
    },
    /**
     * @method handlePromptCanvasSwipeUp
     */
    handlePromptCanvasSwipeUp: function() {
        this.prompt.review.set({
            complete: false,
            failedConsecutive: 0,
            failedTotal: 0,
            teach: false
        });
        this.prompt.review.character.reset();
        this.render();
    },
    /**
     * @method handlePromptDoubleTap
     */
    handlePromptDoubleTap: function() {
        var expectedShape = this.prompt.review.character.getTargetShape();
        if (expectedShape) {this.prompt.canvas.clearLayer('character-hint');
            this.prompt.canvas.drawShape(
                'character-hint',
                this.prompt.review.character.getTargetShape(),
                {color: '#e8ded2'}
            );
        }
    },
    /**
     * @method handlePromptCanvasTap
     */
    handlePromptCanvasTap: function() {
        var expectedStroke = this.prompt.review.character.getExpectedStroke() ;
        if (expectedStroke) {
            this.prompt.canvas.clearLayer('stroke-hint');
            this.prompt.canvas.fadeShape('stroke-hint', expectedStroke.getTargetShape());
        }
    },
    /**
     * @method handlePromptToolbarGradingMousedown
     * @param {Number} value
     */
    handlePromptToolbarGradingMousedown: function(value) {
        if (this.prompt.review.isComplete()) {
            this.prompt.review.set('score', value);
            this.prompt.canvas.injectLayerColor(
                'character',
                this.prompt.review.getGradingColor()
            );
        }
    }
});