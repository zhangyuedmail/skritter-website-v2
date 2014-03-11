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
            Tone.canvas.setElement(this.$('#canvas-container')).render();
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
                var possibleTones = _.flatten(Prompt.review.vocab().tones());
                if (possibleTones.indexOf(result.get('tone')) > -1) {
                    Tone.canvas.tweenShape('display', result.userShape(), result.inflateShape());
                    Tone.canvas.injectLayerColor('display', Prompt.colors[3]);
                } else {
                    Tone.canvas.drawShape('display', Prompt.review.character().targets[possibleTones[0] - 1].shape());
                    Tone.canvas.injectLayerColor('display', Prompt.colors[1]);
                }
                if (Prompt.review.character().isFinished()) {
                    Tone.canvas.disableInput();
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
            var canvasSize = 600;
            if (settings.orientation() === 'landscape') {
                canvasSize = settings.height();
                Rune.canvas.resize(canvasSize).render();
            } else {
                canvasSize = settings.width();
                Rune.canvas.resize(canvasSize).render();
            }
            skritter.settings.set('canvasSize', canvasSize);
            if (Prompt.review.character().length > 0) {
                Tone.canvas.drawCharacterFromFont('background', Prompt.review.vocab().characters()[Prompt.review.get('position') - 1], skritter.user.settings.font(), 0.6);
            } else {
                Tone.canvas.drawCharacterFromFont('background', Prompt.review.vocab().characters()[Prompt.review.get('position') - 1], skritter.user.settings.font(), 1.0);
            }
            Prompt.prototype.resize.call(this, settings);
        },
        /**
         * @method show
         */
        show: function() {
            Tone.canvas.enableInput();
            Tone.canvas.drawCharacterFromFont('background', Prompt.review.vocab().characters()[Prompt.review.get('position') - 1], skritter.user.settings.font());
            this.showWriting();
            this.showReading(Prompt.review.get('position'));
            this.showDefinition();
            this.showSentence();
        }
    });
    
    return Tone;
});