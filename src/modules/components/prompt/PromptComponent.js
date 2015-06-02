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
            this.listenTo(this.canvas, 'canvas:click', this.handleCanvasClick);
            this.listenTo(this.canvas, 'input:up', this.handleCanvasInputUp);
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
            this.activeCharacter = this.items.getCharacter();
            this.activeItem = this.items.getItem();
            switch (this.items.part) {
                case 'defn':
                    //this.renderPromptDefn();
                    break;
                case 'rdng':
                    //this.renderPromptRdng();
                    break;
                case 'rune':
                    this.renderPromptRune();
                    break;
                case 'tone':
                    //this.renderPromptTone();
                    break;
            }
            return this;
        },
        /**
         * @method renderPromptRune
         * @returns {PromptComponent}
         */
        renderPromptRune: function() {
            if (this.activeCharacter.isComplete()) {
                this.canvas.disableInput();
                this.canvas.injectLayerColor('surface', this.activeItem.getGradingColor());
            } else {
                this.canvas.enableInput();
            }
            return this;
        },
        /**
         * @method handleCanvasClick
         */
        handleCanvasClick: function() {

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
                    //this.recognizeTone(points, shape);
                    break;
            }
        },
        /**
         * @method recognizeRune
         * @param {Array} points
         * @param {createjs.Shape} shape
         */
        recognizeRune: function(points, shape) {
            var stroke = this.activeCharacter.recognize(points, shape);
            if (stroke) {
                var targetShape = stroke.getTargetShape();
                var userShape = stroke.getUserShape();
                this.canvas.tweenShape('surface', userShape, targetShape);
                this.renderPrompt();
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
         * @param {Object} [options]
         * @returns {PromptComponent}
         */
        set: function(items, options) {
            console.log('PROMPT:', items);
            this.items = items;
            this.renderPrompt();
            this.details.renderFields();
            return this;
        }
    });

    return PromptComponent;

});