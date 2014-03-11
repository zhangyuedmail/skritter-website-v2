/**
 * @module Skritter
 * @submodule Views
 * @param templateTone
 * @param Canvas
 * @param Prompt
 * @author Joshua McFarland
 */
define([
    'require.text!templates/prompt-tone.html',
    'views/prompts/Canvas',
    'views/prompts/Prompt'
], function(templateTone, Canvas, Prompt) {
    /**
     * @class PromptTone
     */
    var Tone = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            Tone.canvas = new Canvas();
            this.listenTo(Tone.canvas, 'input:up', this.handleInput);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateTone);
            Tone.canvas.setElement(this.$('#canvas-container'));
            Prompt.prototype.render.call(this);
            return this;
        },
        /**
         * @method clear
         * @returns {Backbone.Model}
         */
        clear: function() {
            Tone.canvas.render();
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
                Tone.canvas.tweenShape('display', result.userShape(), result.inflateShape());
                if (Prompt.review.character().isFinished()) {
                    Tone.canvas.disableInput();
                    Tone.canvas.injectLayerColor('display', 'green');
                    Prompt.gradingButtons.show();
                    this.showReading(Prompt.review.get('position') + 1);
                }
            }
        },
        /**
         * @method resize
         * @param {Backbone.Model} settings
         */
        resize: function(settings) {
            settings = settings ? settings : skritter.settings;
            if (settings.orientation() === 'landscape') {
                Tone.canvas.resize(settings.height()).render();
            } else {
                Tone.canvas.resize(settings.width()).render();
            }
            Prompt.prototype.resize.call(this, settings);
        },
        /**
         * @method show
         */
        show: function() {
            Tone.canvas.enableInput();
            this.showWriting();
            this.showReading(Prompt.review.get('position'));
            this.showDefinition();
            this.showSentence();
        }
    });
    
    return Tone;
});