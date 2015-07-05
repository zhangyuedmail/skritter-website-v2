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
        this.reviews = null;
        this.teaching = false;
        this.listenTo(this.canvas, 'canvas:click', this.handleCanvasClick);
        this.listenTo(this.canvas, 'input:up', this.handleCanvasInputUp);
        this.listenTo(this.canvas, 'navigate:left', this.handleNavigateLeft);
        this.listenTo(this.canvas, 'navigate:right', this.handleNavigateRight);
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
     * @method renderPrompt
     * @returns {Prompt}
     */
    renderPrompt: function() {
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
        if (this.reviews.isFirst()) {
            this.$('#navigate-left').hide();
        } else {
            this.$('#navigate-left').show();
        }
        return this;
    },
    /**
     * @method renderPromptDefn
     * @returns {Prompt}
     */
    renderPromptDefn: function() {
        this.canvas.reset();
        this.canvas.disableGrid();
        this.grading.unselect();
        this.toolbar.enable();
        if (this.review().isComplete()) {
            this.handlePromptDefnComplete();
        } else {
            this.review().start();
            this.canvas.revealDefinitionQuestion();
            this.details.hideDefinition();
            this.details.revealReading();
            this.details.revealReadingTone();
            this.details.revealWriting();
            this.grading.hide();
            this.toolbar.disableErase();
            this.toolbar.disableShow();
            this.toolbar.disableStrokeOrder();
        }
        return this;
    },
    /**
     * @method renderPromptRdng
     * @returns {Prompt}
     */
    renderPromptRdng: function() {
        this.canvas.reset();
        this.canvas.disableGrid();
        this.grading.unselect();
        this.toolbar.enable();
        if (this.review().isComplete()) {
            this.handlePromptRdngComplete();
        } else {
            this.review().start();
            this.canvas.revealReadingQuestion();
            this.details.hideReading();
            this.details.revealWriting();
            this.grading.hide();
            this.toolbar.disableErase();
            this.toolbar.disableShow();
            this.toolbar.disableStrokeOrder();
        }
        return this;
    },
    /**
     * @method renderPromptRune
     * @returns {Prompt}
     */
    renderPromptRune: function() {
        this.canvas.reset();
        this.canvas.enableGrid();
        this.canvas.drawShape('surface', this.character().getUserShape());
        this.details.revealDefinition();
        this.details.selectWriting(this.position());
        this.grading.unselect();
        this.toolbar.enable();
        if (this.review().isComplete()) {
            this.handlePromptRuneComplete();
        } else {
            this.review().start();
            this.canvas.enableInput();
            this.details.revealReading();
            this.details.revealReadingTone();
            this.grading.show();
        }
        return this;
    },
    /**
     * @method renderPromptTone
     * @returns {Prompt}
     */
    renderPromptTone: function() {
        this.canvas.reset();
        this.canvas.disableGrid();
        this.canvas.drawCharacter('surface-background2', this.review().vocab.get('writing'), {
            color: '#e8ded2',
            font: this.review().vocab.getFontName()
        });
        this.canvas.drawShape('surface', this.character().getUserShape());
        this.details.revealDefinition();
        this.details.revealWriting();
        this.grading.unselect();
        this.toolbar.enable();
        if (this.review().isComplete()) {
            this.handlePromptToneComplete();
        } else {
            this.review().start();
            this.canvas.enableInput();
            this.details.revealReading();
            this.grading.show();
            this.toolbar.disableErase();
            this.toolbar.disableShow();
            this.toolbar.disableStrokeOrder();
        }
        return this;
    },
    /**
     * method character
     * @returns {PromptCharacter}
     */
    character: function() {
        return this.review().character;
    },
    /**
     * @method disableTeaching
     * @returns {Prompt}
     */
    disableTeaching: function() {
        this.canvas.clearLayer('input-background2');
        this.toolbar.disableStrokeOrder();
        this.teaching = false;
    },
    /**
     * @method enableTeaching
     * @returns {Prompt}
     */
    enableTeaching: function() {
        this.teach();
    },
    /**
     * @method erase
     */
    erase: function() {
        if (this.reviews.part === 'rune' && this.character()) {
            this.character().reset();
            this.canvas.reset();
            this.details.hideWriting(this.position());
            this.toolbar.enableShow();
            this.renderPrompt();
        }
    },
    /**
     * @method handleCanvasClick
     */
    handleCanvasClick: function() {
        if (this.review().isComplete()) {
            this.next();
        } else {
            switch (this.reviews.part) {
                case 'defn':
                    this.review().set('complete', true);
                    this.renderPrompt();
                    break;
                case 'rdng':
                    this.review().set('complete', true);
                    this.renderPrompt();
                    break;
                case 'rune':
                    this.review().stopThinking();
                    break;
                case 'tone':
                    this.review().stopThinking();
                    break;
            }
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
        this.review().stop();
        this.previous();
    },
    /**
     * @method handleNavigateRight
     */
    handleNavigateRight: function() {
        this.review().stop();
        this.next();
    },
    /**
     * @method handlePromptDefnComplete
     */
    handlePromptDefnComplete: function() {
        this.review().stop();
        this.canvas.revealDefinitionAnswer();
        this.details.revealDefinition();
        this.grading.select(this.review().get('score'));
        this.grading.show();
        this.toolbar.disableErase();
        this.toolbar.disableShow();
        this.toolbar.disableStrokeOrder();
        if (app.user.settings.isAudioEnabled()) {
            this.reviews.vocab.play();
        }
    },
    /**
     * @method handlePromptRdngComplete
     */
    handlePromptRdngComplete: function() {
        this.review().stop();
        this.canvas.revealReadingAnswer();
        this.details.revealReading();
        this.details.revealReadingTone();
        this.grading.select(this.review().get('score'));
        this.grading.show();
        this.toolbar.disableErase();
        this.toolbar.disableShow();
        this.toolbar.disableStrokeOrder();
        if (app.user.settings.isAudioEnabled()) {
            this.reviews.vocab.play();
        }
    },
    /**
     * @method handlePromptRuneComplete
     */
    handlePromptRuneComplete: function() {
        this.review().stop();
        this.canvas.disableInput();
        this.canvas.injectLayerColor('surface', this.review().getGradingColor());
        this.details.revealWriting(this.position());
        this.grading.select(this.review().get('score'));
        this.toolbar.disableShow();
        this.toolbar.disableStrokeOrder();
        this.disableTeaching();
    },
    /**
     * @method handlePromptToneComplete
     */
    handlePromptToneComplete: function() {
        this.review().stop();
        this.canvas.disableInput();
        this.canvas.injectLayerColor('surface', this.review().getGradingColor());
        this.details.revealReading(this.position());
        this.details.revealReadingTone(this.position());
        this.grading.select(this.review().get('score'));
        this.toolbar.disableShow();
        this.toolbar.disableStrokeOrder();
        if (app.user.settings.isAudioEnabled()) {
            this.reviews.vocab.play();
        }
    },
    /**
     * @method handleSelectGrading
     * @param {Number} score
     */
    handleSelectGrading: function(score) {
        this.review().set('score', score);
        if (this.review().isComplete()) {
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
     * @method position
     * @returns {Number}
     */
    position: function() {
        return this.reviews.position;
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
        var stroke = this.character().recognize(points, shape);
        if (stroke) {
            var targetShape = stroke.getTargetShape();
            var userShape = stroke.getUserShape();
            this.canvas.tweenShape('surface', userShape, targetShape);
            if (this.teaching) {
                this.teach();
            }
            if (this.character().isComplete()) {
                this.handlePromptRuneComplete();
            }
        }
    },
    /**
     * @method recognizeTone
     * @param {Array} points
     * @param {createjs.Shape} shape
     */
    recognizeTone: function(points, shape) {
        var character = this.character();
        var stroke = character.recognize(points, shape);
        var possibleTones = this.reviews.getToneNumbers();
        var expectedTone = this.character().getTone(possibleTones[0]);
        if (stroke && app.fn.getLength(points) > 30) {
            var targetShape = stroke.getTargetShape();
            var userShape = stroke.getUserShape();
            if (possibleTones.indexOf(stroke.get('tone')) > -1) {
                this.canvas.tweenShape('surface', userShape, targetShape);
                this.review().set('score', 3);
            } else {
                this.canvas.drawShape('surface', expectedTone.getTargetShape());
                this.review().set('score', 1);
            }
        } else {
            character.add(character.getExpectedStroke());
            if (possibleTones.indexOf(5) > -1) {
                this.canvas.drawShape('surface', character.getTargetShape());
                this.review().set('score', 3);
            } else {
                this.canvas.drawShape('surface', expectedTone.getTargetShape());
                this.review().set('score', 1);
            }
        }
        if (this.character().isComplete()) {
            this.handlePromptToneComplete();
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
        if (this.reviews) {
            this.renderPrompt();
        }
        return this;
    },
    /**
     * @method review
     * @returns {PromptReview}
     */
    review: function() {
        return this.reviews.active();
    },
    /**
     * @method reveal
     * @returns {Prompt}
     */
    reveal: function() {
        if (this.reviews.part === 'rune' && this.character() && !this.review().isComplete()) {
            var shape = this.character().getTargetShape();
            this.review().set('score', 1);
            this.canvas.clearLayer('surface-background2');
            this.canvas.drawShape('surface-background2', shape, {
                color: '#e8ded2'
            });
            this.toolbar.disableShow();
        }
        return this;
    },
    /**
     * @method set
     * @param {PromptReviews} reviews
     * @returns {Prompt}
     */
    set: function(reviews) {
        this.reviews = reviews;
        /**
        this.canvas.reset();
        this.canvas.renderFields();
        this.details.renderFields();
        if (this.reviews.part === 'rune' &&
            app.user.settings.isAudioEnabled()) {
            this.reviews.vocab.play();
        }
        this.renderPrompt();
         **/
        return this;
    },
    /**
     * @method enableTeaching
     * @returns {Prompt}
     */
    teach: function() {
        if (this.reviews.part === 'rune' && this.character() && !this.review().isComplete()) {
            this.reveal();
            this.canvas.clearLayer('input-background2');
            this.canvas.tracePath('input-background2', this.character().getExpectedStroke().getParamPath());
            this.toolbar.disableStrokeOrder();
            this.teaching = true;
        } else {
            this.disableTeaching();
        }
        return this;
    }
});