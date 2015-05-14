/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/prompt.html',
    'core/modules/GelatoComponent',
    'modules/components/PromptCanvas',
    'modules/components/PromptDetail',
    'modules/components/PromptGrading',
    'modules/components/PromptToolbar'
], function(
    Template,
    GelatoComponent,
    PromptCanvas,
    PromptDetail,
    PromptGrading,
    PromptToolbar
) {

    /**
     * @class Prompt
     * @extends GelatoComponent
     */
    var Prompt = GelatoComponent.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.canvas = new PromptCanvas({prompt: this});
            this.detail = new PromptDetail({prompt: this});
            this.grading = new PromptGrading({prompt: this});
            this.toolbar = new PromptToolbar({prompt: this});
            this.items = null;
            this.part = 'rune';
            this.position = 0;
            this.listenTo(this.canvas, 'canvas:click', this.handleCanvasClick);
            this.listenTo(this.canvas, 'input:up', this.handleCanvasInputUp);
            this.listenTo(this.canvas, 'navigate:right', this.handleNavigateRight);
            this.listenTo(this.canvas, 'navigate:left', this.handleNavigateLeft);
            this.listenTo(this.grading, 'select', this.handleGradeSelect);
            this.on('resize', this.resize);
        },
        /**
         * @method render
         * @returns {Prompt}
         */
        render: function() {
            this.renderTemplate(Template);
            this.canvas.setElement('#prompt-canvas-container').render();
            this.detail.setElement('#prompt-detail-container').render();
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
         * @returns {Prompt}
         */
        renderPromptDefn: function() {
            return this;
        },
        /**
         * @method renderPromptRdng
         * @returns {Prompt}
         */
        renderPromptRdng: function() {
            return this;
        },
        /**
         * @method renderPromptRune
         * @returns {Prompt}
         */
        renderPromptRune: function() {
            if (this.character().isComplete()) {
                this.canvas.disableInput();
                this.canvas.injectLayerColor('surface', this.active().getGradingColor());
            } else {
                this.canvas.enableInput();
            }
            return this;
        },
        /**
         * @method renderPromptTone
         * @returns {Prompt}
         */
        renderPromptTone: function() {
            var writing = this.vocab.getCharacters()[this.position];
            this.canvas.drawCharacter('surface-background2', writing, {
                color: '#ebeaf0',
                font: this.vocab.getFontName()
            });
            if (this.character().isComplete()) {
                this.canvas.disableInput();
            } else {
                this.canvas.enableInput();
            }
            return this;
        },
        /**
         * @method active
         * @returns {PromptResult}
         */
        active: function() {
            return this.items.at(this.position);
        },
        /**
         * @method character
         * @returns {CanvasCharacter}
         */
        character: function() {
            return this.active().get('character');
        },
        /**
         * @method erase
         * @returns {Prompt}
         */
        erase: function() {
            this.canvas.reset();
            this.character().reset();
            this.renderPrompt();
            return this;
        },
        /**
         * @method handleCanvasClick
         */
        handleCanvasClick: function() {
            if (this.character().isComplete()) {
                this.next();
            }
        },
        /**
         * @method handleCanvasInputUp
         * @param {Array} points
         * @param {createjs.Shape} shape
         */
        handleCanvasInputUp: function(points, shape) {
            switch (this.part) {
                case 'rune':
                    this.recognizeRune(points, shape);
                    break;
                case 'tone':
                    this.recognizeTone(points, shape);
                    break;
            }
        },
        /**
         * @method handleGradeSelect
         * @param {Number} value
         */
        handleGradeSelect: function(value) {
            this.active().set('score', value);
            this.renderPrompt();
        },
        /**
         * @method handleNavigateLeft
         */
        handleNavigateLeft: function() {
            this.previous();
        },
        /**
         * @method handleNavigateRight
         */
        handleNavigateRight: function() {
            this.next();
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
                this.renderPrompt();
            }
        },
        /**
         * @method recognizeTone
         * @param {Array} points
         * @param {createjs.Shape} shape
         */
        recognizeTone: function(points, shape) {
            var stroke = this.character().recognize(points, shape);
            if (stroke) {
                var targetShape = stroke.getTargetShape();
                var userShape = stroke.getUserShape();
                this.canvas.tweenShape('surface', userShape, targetShape);
                this.renderPrompt();
            }
        },
        /**
         * @method isFirst
         * @returns {Boolean}
         */
        isFirst: function() {
            return this.position === 0;
        },
        /**
         * @method isLast
         * @returns {Boolean}
         */
        isLast: function() {
            return this.position >= this.items.length - 1;
        },
        /**
         * @method next
         * @returns {Prompt}
         */
        next: function() {
            if (this.isLast()) {
                console.log('POSITION', 'LAST');
                this.trigger('prompt:next', this.items);
            } else {
                this.position++;
                this.renderPrompt();
            }
            return this;
        },
        /**
         * @method previous
         * @returns {Prompt}
         */
        previous: function() {
            if (this.isFirst()) {
                console.log('POSITION', 'FIRST');
                this.trigger('prompt:previous', this.items);
            } else {
                this.position--;
                this.renderPrompt();
            }
            return this;
        },
        /**
         * @method remove
         * @returns {Prompt}
         */
        remove: function() {
            this.canvas.remove();
            this.detail.remove();
            this.grading.remove();
            this.toolbar.remove();
            return GelatoComponent.prototype.remove.call(this);
        },
        /**
         * @method reveal
         * @returns {Prompt}
         */
        reveal: function() {
            var targetStroke = this.character().getExpectedTargets()[0];
            if (targetStroke) {
                var targetShape = targetStroke.getTargetShape();
                this.canvas.clearLayer('surface-background2');
                this.canvas.drawShape('surface-background2', targetShape, {color: '#ebeaf0'});
            }
            return this;
        },
        /**
         * @method resize
         * @returns {Prompt}
         */
        resize: function() {
            var panelLeft = this.$('#panel-left');
            //var panelRight = this.$('#panel-right');
            this.canvas.resize(panelLeft.find('#panel-left-center').width());
            //TODO: render prompt again
            return this;
        },
        /**
         * @method set
         * @param {PromptItems} items
         * @returns {Prompt}
         */
        set: function(items) {
            console.log('PROMPT:', items);
            this.items = items;
            this.detail.renderFields();
            this.vocab = this.active().getVocab();
            this.resize().renderPrompt();
            return this;
        },
        /**
         * @method show
         * @returns {Prompt}
         */
        show: function() {
            return GelatoComponent.prototype.show.call(this).resize();
        },
        /**
         * @method teach
         * @returns {Prompt}
         */
        teach: function() {
            //TODO: implement new teaching mode
            //var targetStroke = this.character().getExpectedStroke();
            //if (targetStroke) {}
            return this;
        }
    });

    return Prompt;

});