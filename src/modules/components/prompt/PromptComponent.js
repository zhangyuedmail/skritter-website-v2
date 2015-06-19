/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!modules/components/prompt/prompt-template.html',
    'core/modules/GelatoComponent',
    'modules/components/prompt/canvas/PromptCanvasComponent',
    'modules/components/prompt/details/PromptDetailsComponent',
    'modules/components/prompt/grading/PromptGradingComponent',
    'modules/components/prompt/toolbar/PromptToolbarComponent'
], function(
    Template,
    GelatoComponent,
    PromptCanvasComponent,
    PromptDetailsComponent,
    PromptGradingComponent,
    PromptToolbarComponent
) {

    /**
     * @class PromptComponent
     * @extends GelatoComponent
     */
    var PromptComponent = GelatoComponent.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.canvas = new PromptCanvasComponent({prompt: this});
            this.details = new PromptDetailsComponent({prompt: this});
            this.grading = new PromptGradingComponent({prompt: this});
            this.toolbar = new PromptToolbarComponent({prompt: this});
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
         * @method render
         * @returns {PromptComponent}
         */
        render: function() {
            this.renderTemplate(Template);
            this.canvas.setElement('#prompt-canvas-container').render();
            this.details.setElement('#prompt-details-container').render();
            this.grading.setElement('#prompt-grading-container').render();
            this.toolbar.setElement('#prompt-toolbar-container').render();
            this.resize();
            return this;
        },
        /**
         * @method renderPrompt
         * @returns {PromptComponent}
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
         * @returns {PromptComponent}
         */
        renderPromptDefn: function() {
            this.canvas.reset();
            this.canvas.disableGrid();
            this.grading.unselect();
            if (this.review().isComplete()) {
                this.handlePromptDefnComplete();
            } else {
                this.review().start();
                this.canvas.revealDefinitionQuestion();
                this.details.hideDefinition();
                this.details.revealReading();
                this.details.revealWriting();
            }
            return this;
        },
        /**
         * @method renderPromptRdng
         * @returns {PromptComponent}
         */
        renderPromptRdng: function() {
            this.canvas.reset();
            this.canvas.disableGrid();
            this.grading.unselect();
            if (this.review().isComplete()) {
                this.handlePromptRdngComplete();
            } else {
                this.review().start();
                this.canvas.revealReadingQuestion();
                this.details.hideReading();
                this.details.revealWriting();
            }
            return this;
        },
        /**
         * @method renderPromptRune
         * @returns {PromptComponent}
         */
        renderPromptRune: function() {
            this.canvas.reset();
            this.canvas.enableGrid();
            this.canvas.drawShape('surface', this.character().getUserShape());
            this.details.revealDefinition();
            this.details.selectWriting(this.position());
            this.grading.unselect();
            if (this.review().isComplete()) {
                this.handlePromptRuneComplete();
            } else {
                this.review().start();
                this.canvas.enableInput();
                this.details.revealReading();
            }
            return this;
        },
        /**
         * @method renderPromptTone
         * @returns {PromptComponent}
         */
        renderPromptTone: function() {
            this.canvas.reset();
            this.canvas.disableGrid();
            this.canvas.drawCharacter('surface-background2', this.review().vocab.get('writing'), {
                color: '#ebeaf0',
                font: this.review().vocab.getFontName()
            });
            this.canvas.drawShape('surface', this.character().getUserShape());
            this.details.revealDefinition();
            this.details.revealWriting();
            this.grading.unselect();
            if (this.review().isComplete()) {
                this.handlePromptToneComplete();
            } else {
                this.review().start();
                this.canvas.enableInput();
                this.details.revealReading();
            }
            return this;
        },
        /**
         * method character
         * @returns {CanvasCharacter}
         */
        character: function() {
            return this.review().character;
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
        },
        /**
         * @method handlePromptRdngComplete
         */
        handlePromptRdngComplete: function() {
            this.review().stop();
            this.canvas.revealReadingAnswer();
            this.details.revealReading();
            this.grading.select(this.review().get('score'));
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
        },
        /**
         * @method handlePromptToneComplete
         */
        handlePromptToneComplete: function() {
            this.review().stop();
            this.canvas.disableInput();
            this.canvas.injectLayerColor('surface', this.review().getGradingColor());
            this.details.revealReading(this.position());
            this.grading.select(this.review().get('score'));
        },
        /**
         * @method handleSelectGrading
         * @param {Number} score
         */
        handleSelectGrading: function(score) {
            this.review().set('score', score);
            if (this.review().isComplete()) {
                this.renderPrompt();
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
            var stroke = this.character().recognize(points, shape);
            var possibleTones = this.reviews.getToneNumbers();
            var expectedTone = this.character().getTone(possibleTones[0]);
            if (stroke) {
                var targetShape = stroke.getTargetShape();
                var userShape = stroke.getUserShape();
                if (possibleTones.indexOf(stroke.get('tone')) > -1) {
                    this.canvas.tweenShape('surface', userShape, targetShape);
                    this.review().set('score', 3);
                } else {
                    this.canvas.drawShape('surface', expectedTone.getTargetShape());
                    this.review().set('score', 1);
                }
                if (this.character().isComplete()) {
                    this.handlePromptToneComplete();
                }
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
         * @returns {PromptComponent}
         */
        resize: function() {
            var panelLeft = this.$('#panel-left');
            var panelRight = this.$('#panel-right');
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
         * @method set
         * @param {PromptReviews} reviews
         * @returns {PromptComponent}
         */
        set: function(reviews) {
            console.log('PROMPT:', reviews.part, reviews.vocab.id, reviews);
            this.reviews = reviews;
            this.canvas.reset();
            this.canvas.renderFields();
            this.details.renderFields();
            this.renderPrompt();
            return this;
        }
    });

    return PromptComponent;

});