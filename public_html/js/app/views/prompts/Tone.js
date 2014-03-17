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
            this.listenTo(Tone.canvas, 'input:up', this.handleStrokeReceived);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateTone);
            Prompt.prototype.render.call(this);
            Tone.canvas.setElement(this.$('#writing-area')).render();
            Tone.canvas.enableInput();
            this.$('#prompt-definition').html(this.review.vocab().get('definitions').en);
            this.$('#prompt-reading').html(this.review.vocab().get('reading'));
            this.$('#prompt-writing').html(this.review.vocab().writingBlocks(1));
            Tone.canvas.drawCharacterFromFont('background', this.review.vocab().characters()[0], skritter.user.settings.font());
            return this;
        },
        handleStrokeReceived: function(points, shape) {
            var result = this.review.characters[0].recognize(points, shape);
            if (result) {
                var possibleTones = _.flatten(this.review.vocab().tones());
                if (possibleTones.indexOf(result.get('tone')) > -1) {
                    Tone.canvas.tweenShape('display', result.userShape(), result.inflateShape());
                    Tone.canvas.injectLayerColor('display', skritter.settings.get('gradingColors')[3]);
                } else {
                    Tone.canvas.drawShape('display', this.review.characters[0].targets[possibleTones[0] - 1].shape());
                    Tone.canvas.injectLayerColor('display', skritter.settings.get('gradingColors')[1]);
                }
                if (this.review.characters[0].isFinished()) {
                    Tone.canvas.disableInput();
                    Prompt.gradingButtons.show();
                }
            }
        },
        /**
         * @method resize
         */
        resize: function() {
            Prompt.prototype.resize.call(this);
            this.$('#top-container').height(skritter.settings.contentHeight() - skritter.settings.contentWidth() - 3);
            this.$('#top-container').width(skritter.settings.contentWidth());
            this.$('#bottom-container').height(skritter.settings.contentHeight() - this.$('#top-container').height() - 3);
            this.$('#bottom-container').width(skritter.settings.contentWidth());
        }
    });

    return Tone;
});