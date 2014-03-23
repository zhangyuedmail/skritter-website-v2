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
            skritter.timer.setReviewLimit(15);
            skritter.timer.setThinkingLimit(10);
            this.listenTo(Tone.canvas, 'input:down', this.handleStrokeDown);
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
            this.$('#prompt-definition').html(this.review.baseVocab().get('definitions').en);
            this.$('#prompt-reading').html(this.review.baseVocab().readingBlocks(this.review.get('position'), skritter.user.settings.get('hideReading')));
            this.$('#prompt-sentence').html(this.review.baseVocab().sentenceWriting());
            this.$('#prompt-style').html(this.review.baseVocab().style());
            this.$('#prompt-writing').html(this.review.baseVocab().get('writing'));
            skritter.timer.start();
            this.resize();
            return this;
        },
        /**
         * @method handleStrokeDown
         * @returns {undefined}
         */
        handleStrokeDown: function() {            
            Tone.canvas.getLayer('background').alpha = 0.6;
        },
        /**
         * @method handleStrokeReceived
         * @param {Array} points
         * @param {CreateJS.Shape} shape
         */
        handleStrokeReceived: function(points, shape) {
            var result = this.review.character().recognize(points, shape);
            if (result) {
                var possibleTones = _.flatten(this.review.baseVocab().tones());
                if (possibleTones.indexOf(result.get('tone')) > -1) {
                    Tone.canvas.tweenShape('display', result.userShape(), result.inflateShape());
                    Tone.canvas.injectLayerColor('display', skritter.settings.get('gradingColors')[3]);
                } else {
                    Tone.canvas.drawShape('display', this.review.character().shape());
                    Tone.canvas.injectLayerColor('display', skritter.settings.get('gradingColors')[1]);
                }
                if (this.review.character().isFinished()) {
                    skritter.timer.stop();
                    Tone.canvas.disableInput();
                    this.$('#prompt-reading').html(this.review.baseVocab().readingBlocks(this.review.get('position') + 1));
                    Prompt.gradingButtons.show();
                }
            }
        },
        /**
         * @method remove
         */
        remove: function() {
            Tone.canvas.remove();
            Prompt.prototype.remove.call(this);
        },
        /**
         * @method resize
         */
        resize: function() {
            Prompt.prototype.resize.call(this);
            Tone.canvas.render();
            Tone.canvas.resize(skritter.settings.canvasSize());
            Tone.canvas.drawCharacterFromFont('background', this.review.baseVocab().characters()[this.review.get('position') - 1], skritter.user.settings.font());
            this.$('#top-container').height(skritter.settings.contentHeight() - skritter.settings.canvasSize() - 3);
            this.$('#top-container').width(skritter.settings.contentWidth());
            this.$('#bottom-container').height(skritter.settings.contentHeight() - this.$('#top-container').height() - 3);
            this.$('#bottom-container').width(skritter.settings.contentWidth());
            this.$('#writing-area').width(skritter.settings.canvasSize());
        }
    });

    return Tone;
});