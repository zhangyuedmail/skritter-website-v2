/**
 * @module Skritter
 * @submodule Views
 * @param templateRune
 * @param Canvas
 * @param Prompt
 * @author Joshua McFarland
 */
define([
    'require.text!templates/prompt-rune.html',
    'views/prompts/Canvas',
    'views/prompts/Prompt'
], function(templateRune, Canvas, Prompt) {
    /**
     * @class PromptRune
     */
    var Rune = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            Rune.canvas = new Canvas();
            this.listenTo(Rune.canvas, 'input:up', this.handleInput);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateRune);
            Rune.canvas.setElement(this.$('#canvas-container'));
            Prompt.prototype.render.call(this);
            return this;
        },
        /**
         * @method clear
         * @returns {Backbone.Model}
         */
        clear: function() {
            Rune.canvas.render();
            Prompt.prototype.clear.call(this);
        },
        /**
         * @method handleInput
         * @param {Array} points
         * @param {CreateJS.Shape} shape
         */
        handleInput: function(points, shape) {
            var result = Prompt.review.character().recognize(points, shape);
            if (result) {
                Rune.canvas.tweenShape('display', result.userShape(), result.inflateShape());
                if (Prompt.review.character().isFinished()) {
                    Rune.canvas.disableInput();
                    Rune.canvas.injectLayerColor('display', 'green');
                    Prompt.gradingButtons.show();
                }
            }
        },
        /**
         * @method resize
         * @param {Backbone.Model} settings
         */
        resize: function(settings) {
            settings = settings ? settings : skritter.settings;
            var canvasSize = 600;
            if (settings.orientation() === 'landscape') {
                canvasSize = settings.height();
                Rune.canvas.resize(canvasSize).render();
            } else {
                canvasSize = settings.width();
                Rune.canvas.resize(canvasSize).render();
            }
            skritter.settings.set('canvasSize', canvasSize);
            Prompt.prototype.resize.call(this, settings);
        },
        /**
         * @method show
         */
        show: function() {
            Rune.canvas.enableInput();
            this.showWriting(Prompt.review.get('position'));
            this.showReading();
            this.showDefinition();
            this.showSentence();
        }
    });

    return Rune;
});