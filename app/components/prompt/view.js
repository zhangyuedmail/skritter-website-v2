var GelatoComponent = require('gelato/modules/component');
var PromptCanvas = require('components/prompt-canvas/view');
var PromptDetails = require('components/prompt-details/view');
var PromptGrading = require('components/prompt-grading/view');
var PromptToolbar = require('components/prompt-toolbar/view');

/**
 * @class Prompt
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.canvas = new PromptCanvas({prompt: this});
        this.details = new PromptDetails({prompt: this});
        this.grading = new PromptGrading({prompt: this});
        this.toolbar = new PromptToolbar({prompt: this});
        this.review = null;
        this.reviews = null;
        this.listenTo(this.canvas, 'canvas:click', this.handleCanvasClick);
        this.listenTo(this.canvas, 'input:up', this.handleCanvasInputUp);
        this.listenTo(this.canvas, 'navigate:left', this.handleNavigateLeft);
        this.listenTo(this.canvas, 'navigate:right', this.handleNavigateRight);
        this.listenTo(this.grading, 'mousedown', this.handleHighlightGrading);
        this.listenTo(this.grading, 'select', this.handleSelectGrading);
        this.on('resize', this.resize);
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('components/prompt/template'),
    /**
     * @method render
     * @returns {Prompt}
     */
    render: function() {
        this.renderTemplate();
        this.canvas.setElement('#prompt-canvas-container').render();
        this.details.setElement('#prompt-details-container').render();
        this.grading.setElement('#prompt-grading-container').render();
        this.toolbar.setElement('#prompt-toolbar-container').render();
        this.resize();
        return this;
    },
    /**
     * @method renderAfterPrompt
     * @returns {Prompt}
     */
    renderAfterPrompt: function() {
        this.review = this.reviews.active();
        switch (this.reviews.part) {
            case 'defn':
                this.renderAfterPromptDefn();
                break;
            case 'rdng':
                this.renderAfterPromptRdng();
                break;
            case 'rune':
                this.renderAfterPromptRune();
                break;
            case 'tone':
                this.renderAfterPromptTone();
                break;
        }
        return this;
    },
    /**
     * @method renderBeforePrompt
     * @returns {Prompt}
     */
    renderBeforePrompt: function() {
        this.review = this.reviews.active();
        this.details.renderFields();
        switch (this.reviews.part) {
            case 'defn':
                this.renderBeforePromptDefn();
                break;
            case 'rdng':
                this.renderBeforePromptRdng();
                break;
            case 'rune':
                this.renderBeforePromptRune();
                break;
            case 'tone':
                this.renderBeforePromptTone();
                break;
        }
        return this;
    },
    /**
     * @method renderPrompt
     * @returns {Prompt}
     */
    renderPrompt: function() {
        this.review = this.reviews.active();
        switch (this.reviews.part) {
            case 'defn':
                this.renderPromptDefn();
                break;
            case 'rdng':
                this.renderPromptRdng();
                break;
            case 'rune':
                this.renderPromptRune();
                break;
            case 'tone':
                this.renderPromptTone();
                break;
        }
        return this;
    },
    /**
     * @method renderAfterPromptDefn
     * @returns {Prompt}
     */
    renderAfterPromptDefn: function() {
        this.review.stop();
        this.review.set('complete', true);
        this.canvas.revealDefinitionAnswer();
        this.details.revealDefinition();
        this.details.showMnemonic();
        this.details.showSentence();
        this.grading.select(this.review.get('score'));
        this.grading.show();
        return this;
    },
    /**
     * @method renderAfterPromptRdng
     * @returns {Prompt}
     */
    renderAfterPromptRdng: function() {
        this.review.stop();
        this.review.set('complete', true);
        this.canvas.revealReadingAnswer();
        this.details.revealReadingTone();
        this.details.showMnemonic();
        this.details.showSentence();
        this.grading.select(this.review.get('score'));
        this.grading.show();
        return this;
    },
    /**
     * @method renderAfterPromptRune
     * @returns {Prompt}
     */
    renderAfterPromptRune: function() {
        this.review.stop();
        this.canvas.disableInput();
        this.canvas.injectLayerColor('surface', this.review.getGradingColor());
        this.details.revealWriting(this.reviews.position);
        this.details.showMnemonic();
        this.details.showSentence();
        this.grading.select(this.review.get('score'));
        this.toolbar.disableShow();
        this.toolbar.disableStrokeOrder();
        return this;
    },
    /**
     * @method renderAfterPromptTone
     * @returns {Prompt}
     */
    renderAfterPromptTone: function() {
        this.review.stop();
        this.canvas.disableInput();
        this.canvas.injectLayerColor('surface', this.review.getGradingColor());
        this.details.revealReading(this.review.position);
        this.details.revealReadingTone(this.review.position);
        this.details.showMnemonic();
        this.details.showSentence();
        this.grading.select(this.review.get('score'));
        return this;
    },
    /**
     * @method renderBeforePromptDefn
     * @returns {Prompt}
     */
    renderBeforePromptDefn: function() {
        this.canvas.renderFields();
        this.canvas.disableGrid();
        this.canvas.disableInput();
        this.details.hideDefinition();
        this.details.revealReading();
        this.details.revealReadingTone();
        this.details.revealWriting();
        this.grading.hide();
        this.toolbar.disableErase();
        this.toolbar.disableShow();
        this.toolbar.disableStrokeOrder();
        return this;
    },
    /**
     * @method renderBeforePromptRdng
     * @returns {Prompt}
     */
    renderBeforePromptRdng: function() {
        this.canvas.renderFields();
        this.canvas.disableGrid();
        this.canvas.disableInput();
        this.details.hideReading();
        this.details.revealWriting();
        this.grading.hide();
        this.toolbar.disableErase();
        this.toolbar.disableShow();
        this.toolbar.disableStrokeOrder();
        return this;
    },
    /**
     * @method renderBeforePromptRune
     * @returns {Prompt}
     */
    renderBeforePromptRune: function() {
        this.canvas.enableGrid();
        this.details.revealDefinition();
        this.details.revealReading();
        this.details.revealReadingTone();
        return this;
    },
    /**
     * @method renderBeforePromptTone
     * @returns {Prompt}
     */
    renderBeforePromptTone: function() {
        this.canvas.disableGrid();
        this.details.revealDefinition();
        this.details.revealReading();
        this.details.revealWriting();
        return this;
    },
    /**
     * @method renderPromptDefn
     * @returns {Prompt}
     */
    renderPromptDefn: function() {
        this.clear();
        if (this.review.isComplete()) {
            this.renderAfterPrompt();
        } else {
            this.review.start();
            this.canvas.revealDefinitionQuestion();
        }
        return this;
    },
    /**
     * @method renderPromptRdng
     * @returns {Prompt}
     */
    renderPromptRdng: function() {
        this.clear();
        if (this.review.isComplete()) {
            this.renderAfterPrompt();
        } else {
            this.review.start();
            this.canvas.revealReadingQuestion();
        }
        return this;
    },
    /**
     * @method renderPromptRune
     * @returns {Prompt}
     */
    renderPromptRune: function() {
        this.clear();
        this.details.selectWriting(this.reviews.position);
        if (this.review.isComplete()) {
            this.renderAfterPrompt();
        } else {
            this.review.start();
            this.canvas.enableInput();
        }
        return this;
    },
    /**
     * @method renderPromptTone
     * @returns {Prompt}
     */
    renderPromptTone: function() {
        this.clear();
        this.canvas.drawCharacter(
            'surface-background2',
            this.review.vocab.get('writing'),
            {
                color: '#e8ded2',
                font: this.review.vocab.getFontName()
            }
        );
        this.canvas.drawShape(
            'surface',
            this.review.character.getUserShape()
        );
        this.toolbar.disableErase();
        this.toolbar.disableShow();
        this.toolbar.disableStrokeOrder();
        if (this.review.isComplete()) {
            this.renderAfterPrompt();
        } else {
            this.review.start();
            this.canvas.enableInput();
        }
        return this;
    },
    /**
     * @method clear
     * @returns {Prompt}
     */
    clear: function() {
        this.canvas.reset();
        this.grading.unselect();
        this.toolbar.enable();
        return this;
    },
    /**
     * @method erase
     */
    erase: function() {
        this.clear();
        this.review.reset();
        this.renderPrompt();
    },
    /**
     * @method handleCanvasClick
     */
    handleCanvasClick: function() {
        if (this.review.isComplete()) {
            this.next();
        } else if (this.reviews.part === 'defn') {
            this.renderAfterPrompt();
        } else if (this.reviews.part === 'rdng') {
            this.renderAfterPrompt();
        } else if (this.reviews.part === 'rune') {
            this.review.stopThinking();
        } else if (this.reviews.part === 'tone') {
            this.review.stopThinking();
        }
    },
    /**
     * @method handleCanvasInputUp
     * @param {Array} points
     * @param {createjs.Shape} shape
     */
    handleCanvasInputUp: function(points, shape) {
        switch (this.reviews.part) {
            case 'rune':
                this.recognizeRune(points, shape);
                break;
            case 'tone':
                this.recognizeTone(points, shape);
                break;
        }
    },
    /**
     * @method handleNavigateLeft
     */
    handleNavigateLeft: function() {
        this.review.stop();
        this.previous();
    },
    /**
     * @method handleNavigateRight
     */
    handleNavigateRight: function() {
        this.review.stop();
        this.next();
    },
    /**
     * @method handleHighlightGrading
     * @param {Number} score
     */
    handleHighlightGrading: function(score) {
        if (this.review.isComplete()) {
            var gradingColor = app.user.settings.get('gradingColors')[score];
            this.canvas.injectLayerColor('surface', gradingColor);
        }
    },
    /**
     * @method handleSelectGrading
     * @param {Number} score
     */
    handleSelectGrading: function(score) {
        this.review.set('score', score);
        if (this.review.isComplete()) {
            this.next();
        }
    },
    /**
     * @method next
     */
    next: function() {
        if (this.reviews.next()) {
            this.renderPrompt();
        } else {
            this.trigger('complete', this.reviews);
        }
    },
    /**
     * @method previous
     */
    previous: function() {
        if (this.reviews.previous()) {
            this.renderPrompt();
        } else {
            this.trigger('previous', this.reviews);
        }
    },
    /**
     * @method recognizeRune
     * @param {Array} points
     * @param {createjs.Shape} shape
     */
    recognizeRune: function(points, shape) {
        var stroke = this.review.character.recognize(points, shape);
        if (stroke) {
            var targetShape = stroke.getTargetShape();
            var userShape = stroke.getUserShape();
            this.canvas.tweenShape('surface', userShape, targetShape);
            if (this.review.isComplete()) {
                this.renderAfterPrompt();
            }
        }
    },
    /**
     * @method recognizeTone
     * @param {Array} points
     * @param {createjs.Shape} shape
     */
    recognizeTone: function(points, shape) {
        var character = this.review.character;
        var stroke = character.recognize(points, shape);
        var possibleTones = this.reviews.getToneNumbers();
        var expectedTone = character.getTone(possibleTones[0]);
        if (stroke && app.fn.getLength(points) > 30) {
            var targetShape = stroke.getTargetShape();
            var userShape = stroke.getUserShape();
            if (possibleTones.indexOf(stroke.get('tone')) > -1) {
                this.canvas.tweenShape('surface', userShape, targetShape);
                this.review.set('score', 3);
            } else {
                character.reset();
                character.add(expectedTone);
                this.canvas.drawShape('surface', expectedTone.getTargetShape());
                this.review.set('score', 1);
            }
        } else {
            character.add(expectedTone);
            if (possibleTones.indexOf(5) > -1) {
                this.canvas.drawShape('surface', character.getTargetShape());
                this.review.set('score', 3);
            } else {
                this.canvas.drawShape('surface', expectedTone.getTargetShape());
                this.review.set('score', 1);
            }
        }
        if (this.review.isComplete()) {
            this.renderAfterPrompt();
        }
    },
    /**
     * @method remove
     * @returns {GelatoView}
     */
    remove: function() {
        this.canvas.remove();
        this.details.remove();
        this.grading.remove();
        this.toolbar.remove();
        return GelatoComponent.prototype.remove.call(this);
    },
    /**
     * @method resize
     * @returns {Prompt}
     */
    resize: function() {
        if (app.getWidth() < 1280) {
            this.canvas.resize(400);
        } else {
            this.canvas.resize(450);
        }
        if (this.review) {
            this.renderPrompt();
        }
        return this;
    },
    /**
     * @method set
     * @param {PromptReviews} reviews
     * @returns {Prompt}
     */
    set: function(reviews) {
        console.info('PROMPT:', reviews.item.id, reviews);
        this.reviews = reviews;
        this.renderBeforePrompt();
        this.renderPrompt();
        return this;
    }
});