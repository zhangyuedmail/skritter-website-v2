/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/prompt.html',
    'core/modules/GelatoComponent',
    'modules/components/WritingCanvas'
], function(Template, GelatoComponent, WritingCanvas) {

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
            this.canvas = new WritingCanvas();
            this.gradingColors = app.user.settings.get('gradingColors');
            this.part = 'rune';
            this.position = 1;
            this.result = null;
            this.listenTo(this.canvas, 'canvas:click', this.handleClickCanvas);
            this.listenTo(this.canvas, 'input:up', this.handleInputUp);
            this.on('resize', this.resize);
        },
        /**
         * @method render
         * @returns {Prompt}
         */
        render: function() {
            this.renderTemplate(Template);
            this.canvas.setElement('.writing-canvas-container').render();
            this.resize();
            return this;
        },
        /**
         * @method renderPrompt
         * @returns {Prompt}
         */
        renderPrompt: function() {
            this.canvas.reset();
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
            var character = this.character().getShape();
            if (this.character().isComplete()) {
                this.active().set('complete', true);
                this.canvas.disableInput();
            } else {
                this.active().set('complete', false);
                this.canvas.enableInput();
            }
            this.canvas.drawShape('surface-background1', character);
            return this;
        },
        /**
         * @method renderPromptTone
         * @returns {Prompt}
         */
        renderPromptTone: function() {
            var writing = this.vocab.getCharacters()[this.position - 1];
            if (this.character().isComplete()) {
                this.active().set('complete', true);

                this.canvas.disableInput();
            } else {
                this.active().set('complete', false);
                this.canvas.enableInput();
            }
            this.canvas.drawShape('surface-background1', this.character().getShape());
            this.canvas.drawCharacter('surface-background2', writing, {color: '#ebeaf0'});
            return this;
        },
        /**
         * @method active
         * @returns {PromptResult}
         */
        active: function() {
            return this.result.at(this.position - 1);
        },
        /**
         * @method character
         * @returns {CanvasCharacter}
         */
        character: function() {
            return this.active().get('character');
        },
        /**
         * @method handleClickCanvas
         */
        handleClickCanvas: function() {
            if (this.active().get('complete')) {
                this.next();
            }
        },
        /**
         * @method handleInputUp
         * @param {Array} points
         * @param {createjs.Shape} shape
         */
        handleInputUp: function(points, shape) {
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
         * @method recognizeRune
         * @param {Array} points
         * @param {createjs.Shape} shape
         */
        recognizeRune: function(points, shape) {
            var stroke = this.character().recognize(points, shape);
            if (stroke) {
                var targetShape = stroke.getShape();
                var userShape = stroke.getUserShape();
                this.canvas.tweenShape('surface', userShape, targetShape);
                if (this.character().isComplete()) {
                    this.active().set('complete', true);
                    this.canvas.disableInput();
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
            if (stroke) {
                var tones = this.vocab.getToneNumbers()[this.position - 1];
                if (tones.indexOf(stroke.get('tone')) > -1) {
                    var targetShape = stroke.getShape();
                    var userShape = stroke.getUserShape();
                    this.canvas.tweenShape('surface', userShape, targetShape);
                } else {
                    this.character().reset();
                    this.character().add(this.character().getTone(tones[0]).clone());
                    this.canvas.drawShape('surface', this.character().at(0).getShape());
                }
                if (this.character().isComplete()) {
                    this.active().set('complete', true);
                    this.canvas.disableInput();
                    this.canvas.injectLayerColor('surface', this.gradingColors[this.active().get('score')]);
                }
            }
        },
        /**
         * @method hideBannerNew
         * @returns {Prompt}
         */
        hideBannerNew: function() {
            this.$('.prompt-banner-new').hide();
            return this;
        },
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
            return this.position >= this.result.length;
        },
        /**
         * @method next
         * @returns {Prompt}
         */
        next: function() {
            if (this.isLast()) {
                console.log('POSITION', 'LAST');
                this.trigger('prompt:complete');
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
            return GelatoComponent.prototype.remove.call(this);
        },
        /**
         * @method resize
         * @returns {Prompt}
         */
        resize: function() {
            console.log('REZZY');
            this.canvas.resize(this.$('.center-column').width());
            return this;
        },
        /**
         * @method set
         * @param {DataVocab} vocab
         * @param {String} part
         * @returns {Prompt}
         */
        set: function(vocab, part) {
            console.log('PROMPT:', vocab.id, part, vocab);
            this.result = vocab.getPromptResult(part);
            this.part = part;
            this.vocab = vocab;
            this.position = 1;
            this.renderPrompt();
            return this;
        },
        /**
         * @method showBannerNew
         * @returns {Prompt}
         */
        showBannerNew: function() {
            this.$('.prompt-banner-new').show();
            return this;
        }
    });

    return Prompt;

});