var GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptPartTone
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
        this.listenTo(this.prompt.canvas, 'input:up', this.handlePromptCanvasInputUp);
        this.listenTo(this.prompt.toolbarAction, 'click:correct', this.handlePromptToolbarActionCorrect);
        this.listenTo(this.prompt.toolbarGrading, 'mousedown', this.handlePromptToolbarGradingMousedown);
        this.on('resize', this.render);
    },
    /**
     * @property el
     * @type {String}
     */
    el: '#review-container',
    /**
     * @property events
     * @type {Object}
     */
    events: {},
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {StudyPromptPartTone}
     */
    render: function() {
        this.renderTemplate();
        this.prompt.review = this.prompt.reviews.current();
        this.prompt.canvas.grid = false;
        this.prompt.canvas.reset();
        this.prompt.canvas.drawCharacter(
            'character-hint',
            this.prompt.review.vocab.get('writing'),
            {
                color: '#e8ded2',
                font: this.prompt.review.vocab.getFontName()
            }
        );
        this.prompt.canvas.drawShape(
            'character',
            this.prompt.review.character.getUserShape(),
            {color: this.prompt.review.getGradingColor()}
        );
        this.prompt.toolbarAction.buttonCorrect = true;
        this.prompt.toolbarAction.buttonErase = false;
        this.prompt.toolbarAction.buttonShow = false;
        this.prompt.toolbarAction.buttonTeach = false;
        if (this.prompt.review.isComplete()) {
            this.renderComplete();
        } else {
            this.renderIncomplete();
        }
        return this;
    },
    /**
     * @method renderComplete
     * @returns {StudyPromptPartTone}
     */
    renderComplete: function() {
        this.prompt.review.stop();
        this.prompt.review.set('complete', true);
        this.prompt.canvas.disableInput();
        this.prompt.canvas.injectLayerColor(
            'character',
            this.prompt.review.getGradingColor()
        );
        this.prompt.navigation.render();
        this.prompt.shortcuts.grading.listen();
        this.prompt.shortcuts.tone.stop_listening();
        this.prompt.toolbarAction.render();
        this.prompt.toolbarGrading.render();
        this.prompt.toolbarGrading.select(this.prompt.review.get('score'));
        this.prompt.toolbarVocab.render();
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
     * @returns {StudyPromptPartTone}
     */
    renderIncomplete: function() {
        this.prompt.review.start();
        this.prompt.review.set('complete', false);
        this.prompt.canvas.enableInput();
        this.prompt.navigation.render();
        this.prompt.shortcuts.grading.stop_listening();
        this.prompt.shortcuts.tone.listen();
        this.prompt.toolbarAction.render();
        this.prompt.toolbarGrading.render();
        this.prompt.toolbarVocab.render();
        this.prompt.vocabDefinition.render();
        this.prompt.vocabMnemonic.render();
        this.prompt.vocabReading.render();
        this.prompt.vocabSentence.render();
        this.prompt.vocabStyle.render();
        this.prompt.vocabWriting.render();
        return this;
    },
    /**
     * @method handlePromptCanvasClick
     */
    handlePromptCanvasClick: function() {
        if (this.prompt.review.isComplete()) {
            this.prompt.next();
        }
    },
    /**
     * @method handlePromptCanvasInputUp
     * @param {Array} points
     * @param {createjs.Shape} shape
     */
    handlePromptCanvasInputUp: function(points, shape) {
        var possibleTones = this.prompt.review.getTones();
        var expectedTone = this.prompt.review.character.getTone(possibleTones[0]);
        var stroke = this.prompt.review.character.recognize(points, shape);
        if (stroke && app.fn.getLength(points) > 30) {
            var targetShape = stroke.getTargetShape();
            var userShape = stroke.getUserShape();
            if (possibleTones.indexOf(stroke.get('tone')) > -1) {
                this.prompt.review.set('score', 3);
                this.prompt.canvas.tweenShape(
                    'character',
                    userShape,
                    targetShape
                );
            } else {
                this.prompt.review.set('score', 1);
                this.prompt.review.character.reset();
                this.prompt.review.character.add(expectedTone);
                this.prompt.canvas.drawShape(
                    'character',
                    expectedTone.getTargetShape()
                );

            }
        } else {
            this.prompt.review.character.add(expectedTone);
            if (possibleTones.indexOf(5) > -1) {
                this.prompt.review.set('score', 3);
                this.prompt.canvas.drawShape(
                    'character',
                    this.prompt.review.character.getTargetShape()
                );
            } else {
                this.prompt.review.set('score', 1);
                this.prompt.canvas.drawShape(
                    'character',
                    expectedTone.getTargetShape()
                );
            }
        }
        if (this.prompt.review.character.isComplete()) {
            this.renderComplete();
        } else {
            this.renderIncomplete();
        }
    },
    /**
     * @method handlePromptToolbarActionCorrect
     */
    handlePromptToolbarActionCorrect: function() {
        this.prompt.review.set('score', this.prompt.review.get('score') === 1 ? 3 : 1);
        this.prompt.toolbarGrading.select(this.prompt.review.get('score'));
        this.prompt.toolbarAction.render();
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