/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/prompt.html',
    'core/modules/GelatoView',
    'modules/components/PromptDetail',
    'modules/components/PromptGrading',
    'modules/components/PromptNavigation',
    'modules/components/PromptToolbar',
    'modules/components/WritingCanvas'
], function(Template, GelatoView, PromptDetail, PromptGrading, PromptNavigation, PromptToolbar, WritingCanvas) {

    /**
     * @class Prompt
     * @extends GelatoView
     */
    var Prompt = GelatoView.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.characters = [];
            this.canvas = new WritingCanvas();
            this.detail = new PromptDetail({prompt: this});
            this.grading = new PromptGrading({prompt: this});
            this.navigation = new PromptNavigation({prompt: this});
            this.part = 'rune';
            this.position = 1;
            this.toolbar = new PromptToolbar({prompt: this});
            this.vocab = null;
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
            this.detail.setElement(this.$('.prompt-detail-container')).render();
            this.grading.setElement(this.$('.prompt-grading-container')).render();
            this.navigation.setElement(this.$('.prompt-navigation-container')).render();
            this.toolbar.setElement('.prompt-toolbar-container').render();
            this.resize();
            return this;
        },
        /**
         * @method renderCharacter
         * @returns {Prompt}
         */
        renderCharacter: function() {
            this.canvas.reset();
            if (this.character().isComplete()) {
                this.canvas.disableInput();
                this.detail.showCharacter();
            } else {
                this.canvas.enableInput();
                this.detail.hideCharacter();
            }
            this.canvas.drawShape('surface-background1', this.character().getShape());
            this.detail.selectCharacter();
            return this;
        },
        /**
         * @method character
         * @returns {CanvasCharacter}
         */
        character: function() {
            return this.characters[this.position - 1];
        },
        /**
         * @method handleClickCanvas
         */
        handleClickCanvas: function() {
            if (this.character().isComplete()) {
                this.next();
            }
        },
        /**
         * @method handleInputUp
         * @param {Array} points
         * @param {createjs.Shape} shape
         */
        handleInputUp: function(points, shape) {
            var stroke = this.character().recognize(points, shape);
            if (stroke) {
                var targetShape = stroke.getShape();
                var userShape = stroke.getUserShape();
                this.canvas.tweenShape('surface', userShape, targetShape);
            }
            if (this.character().isComplete()) {
                this.canvas.disableInput();
                this.detail.showCharacter();
            }
        },
        /**
         * @method hide
         * @returns {Prompt}
         */
        hide: function() {
            this.$el.hide();
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
            return this.position >= this.characters.length;
        },
        /**
         * @method next
         * @returns {Prompt}
         */
        next: function() {
            if (this.isLast()) {
                this.trigger('prompt:complete');
            } else {
                this.position++;
                this.renderCharacter();
            }
            return this;
        },
        /**
         * @method previous
         * @returns {Prompt}
         */
        previous: function() {
            if (this.isFirst()) {
                console.log('No going back!');
            } else {
                this.position--;
                this.renderCharacter();
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
            return GelatoView.prototype.remove.call(this);
        },
        /**
         * @method resize
         * @returns {Prompt}
         */
        resize: function() {
            this.canvas.resize(450);
            return this;
        },
        /**
         * @method set
         * @param {DataVocab} vocab
         * @param {String} part
         * @param {Boolean} isNew
         * @returns {Prompt}
         */
        set: function(vocab, part, isNew) {
            this.characters = vocab.getCanvasCharacters();
            this.part = part;
            this.vocab = vocab;
            this.detail.renderFields();
            this.setNewBanner(isNew);
            this.renderCharacter();
            this.resize();
            return this;
        },
        /**
         * @method setNewBanner
         * @param {Boolean} visible
         * @returns {Prompt}
         */
        setNewBanner: function(visible) {
            if (visible) {
                this.$('.vocab-new').show();
            } else {
                this.$('.vocab-new').hide();
            }
            return this;
        },
        /**
         * @method show
         * @returns {Prompt}
         */
        show: function() {
            this.$el.show();
            return this;
        }
    });

    return Prompt;

});