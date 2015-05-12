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
    'modules/components/PromptNavigation',
    'modules/components/PromptToolbar'
], function(Template, GelatoComponent, PromptCanvas, PromptDetail, PromptGrading, PromptNavigation, PromptToolbar) {

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
            this.navigation = new PromptNavigation({prompt: this});
            this.toolbar = new PromptToolbar({prompt: this});
            this.items = null;
            this.part = 'rune';
            this.position = 1;
            this.listenTo(this.canvas, 'canvas:click', this.handleCanvasClick);
            this.listenTo(this.canvas, 'input:up', this.handleCanvasInputUp);
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
            this.navigation.setElement('#prompt-navigation-container').render();
            this.toolbar.setElement('#prompt-toolbar-container').render();
            this.resize();
            return this;
        },
        /**
         * @method renderPrompt
         * @returns {Prompt}
         */
        renderPrompt: function() {
            switch (this.part) {
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
            return this;
        },
        /**
         * @method active
         * @returns {PromptResult}
         */
        active: function() {
            return this.items.at(this.position - 1);
        },
        /**
         * @method character
         * @returns {CanvasCharacter}
         */
        character: function() {
            return this.active().get('character');
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
         * @param value
         */
        handleGradeSelect: function(value) {},
        /**
         * @method recognizeRune
         * @param {Array} points
         * @param {createjs.Shape} shape
         */
        recognizeRune: function(points, shape) {
            if (points.length > 4) {
                var nextStroke = this.character().getNextStroke();
                this.character().add(nextStroke);
                this.canvas.drawShape('surface', nextStroke.getShape());
                this.renderPrompt();
            }
        },
        /**
         * @method recognizeTone
         * @param {Array} points
         * @param {createjs.Shape} shape
         */
        recognizeTone: function(points, shape) {},
        /**
         * @method isFirst
         * @returns {Boolean}
         */
        isFirst: function() {
            return this.position === 1;
        },
        /**
         * @method isLast
         * @returns {Boolean}
         */
        isLast: function() {
            return this.position >= this.items.length;
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
            this.navigation.remove();
            this.toolbar.remove();
            return GelatoComponent.prototype.remove.call(this);
        },
        /**
         * @method resize
         * @returns {Prompt}
         */
        resize: function() {
            var panelLeft = this.$('#panel-left');
            var panelRight = this.$('#panel-right');
            this.canvas.resize(panelLeft.find('#panel-left-center').width());
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
            this.renderPrompt();
            this.resize();
            return this;
        },
        /**
         * @method show
         * @returns {Prompt}
         */
        show: function() {
            return GelatoComponent.prototype.show.call(this).resize();
        }
    });

    return Prompt;

});