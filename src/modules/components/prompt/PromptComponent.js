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
            this.items = null;
            this.teaching = false;
            this.vocab = null;
            this.listenTo(this.canvas, 'canvas:click', this.handleCanvasClick);
            this.listenTo(this.canvas, 'input:up', this.handleCanvasInputUp);
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
            switch (this.items.part) {
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
         * @method renderPromptDefn
         * @returns {PromptComponent}
         */
        renderPromptDefn: function() {
            console.log(this.items);
            this.canvas.reset();
            this.canvas.disableGrid();
            this.grading.unselect();
            if (this.item().isComplete()) {
                this.handlePromptDefnComplete();
            } else {
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
            if (this.item().isComplete()) {
                this.handlePromptRdngComplete();
            } else {
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
            if (this.item().isComplete()) {
                this.handlePromptRuneComplete();
            } else {
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
            this.canvas.drawCharacter('surface-background2', this.vocab.get('writing'), {
                color: '#ebeaf0',
                font: this.vocab.getFontName()
            });
            this.canvas.drawShape('surface', this.character().getUserShape());
            this.details.revealDefinition();
            this.details.revealWriting();
            this.grading.unselect();
            if (this.item().isComplete()) {
                this.handlePromptToneComplete();
            } else {
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
            return this.items.getCharacter();
        },
        /**
         * @method handleCanvasClick
         */
        handleCanvasClick: function() {
            if (this.item().isComplete()) {
                if (this.items.next()) {
                    this.renderPrompt();
                } else {
                    console.log('PROMPT COMPLETE');
                    this.trigger('complete');
                }
            } else {
                switch (this.items.part) {
                    case 'defn':
                        this.item().set('complete', true);
                        this.renderPrompt();
                        break;
                    case 'rdng':
                        this.item().set('complete', true);
                        this.renderPrompt();
                        break;
                    default:
                    //TODO: fade the background shadow
                }
            }
        },
        /**
         * @method handleCanvasInputUp
         */
        handleCanvasInputUp: function(points, shape) {
            switch (this.items.part) {
                case 'rune':
                    this.recognizeRune(points, shape);
                    break;
                case 'tone':
                    this.recognizeTone(points, shape);
                    break;
            }
        },
        /**
         * @method handlePromptDefnComplete
         */
        handlePromptDefnComplete: function() {
            this.canvas.revealDefinitionAnswer();
            this.details.revealDefinition();
            this.grading.select(this.item().get('score'));
        },
        /**
         * @method handlePromptRdngComplete
         */
        handlePromptRdngComplete: function() {
            this.canvas.revealReadingAnswer();
            this.details.revealReading();
            this.grading.select(this.item().get('score'));
        },
        /**
         * @method handlePromptRuneComplete
         */
        handlePromptRuneComplete: function() {
            this.canvas.disableInput();
            this.canvas.injectLayerColor('surface', this.item().getGradingColor());
            this.details.revealWriting(this.position());
            this.grading.select(this.item().get('score'));
        },
        /**
         * @method handlePromptToneComplete
         */
        handlePromptToneComplete: function() {
            this.canvas.disableInput();
            this.canvas.injectLayerColor('surface', this.item().getGradingColor());
            this.details.revealReading(this.position(), true);
            this.grading.select(this.item().get('score'));
        },
        /**
         * @method handleSelectGrading
         * @param {Number} score
         */
        handleSelectGrading: function(score) {
            this.item().set('score', score);
            if (this.character().isComplete()) {
                this.renderPrompt();
            }
        },
        /**
         * @method item
         * @returns {PromptItem}
         */
        item: function() {
            return this.items.getItem();
        },
        /**
         * @method position
         * @returns {Number}
         */
        position: function() {
            return this.items.position;
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
            var possibleTones = this.items.getToneNumbers();
            var expectedTone = this.character().getTone(possibleTones[0]);
            if (stroke) {
                var targetShape = stroke.getTargetShape();
                var userShape = stroke.getUserShape();
                if (possibleTones.indexOf(stroke.get('tone')) > -1) {
                    this.canvas.tweenShape('surface', userShape, targetShape);
                    this.item().set('score', 3);
                } else {
                    this.canvas.drawShape('surface', expectedTone.getTargetShape());
                    this.item().set('score', 1);
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
            this.canvas.resize(450);
            return this;
        },
        /**
         * @method set
         * @param {PromptItems} items
         * @returns {PromptComponent}
         */
        set: function(items) {
            console.log('PROMPT:', items.getVocab(), items);
            this.items = items;
            this.vocab = items.getVocab();
            this.canvas.reset();
            this.canvas.renderFields();
            this.details.renderFields();
            this.renderPrompt();
            return this;
        }
    });

    return PromptComponent;

});