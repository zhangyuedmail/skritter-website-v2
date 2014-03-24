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
            Tone.canvas.grid = false;
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
            this.$('#writing-area').hammer().off('tap', _.bind(this.handleTap, this));
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
            var possibleTones = _.flatten(this.review.baseVocab().tones(this.review.get('position')));
            if (points.length > 5) {
                var result = this.review.character().recognize(points, shape);
                if (result) {
                    if (possibleTones.indexOf(result.get('tone')) > -1) {
                        Tone.canvas.tweenShape('display', result.userShape(), result.inflateShape());
                        Tone.canvas.injectLayerColor('display', skritter.settings.get('gradingColors')[3]);
                    } else {
                        Tone.canvas.drawShape('display', this.review.character().targets[possibleTones[0] - 1].shape());
                        Tone.canvas.injectLayerColor('display', skritter.settings.get('gradingColors')[1]);
                    }
                }
            } else {
                this.review.character().add(this.review.character().targets[4].models);
                if (possibleTones.indexOf(5) > -1) {
                    Tone.canvas.drawShape('display', this.review.character().shape());
                    Tone.canvas.injectLayerColor('display', skritter.settings.get('gradingColors')[3]);
                } else {
                    Tone.canvas.drawShape('display', this.review.character().targets[possibleTones[0] - 1].shape());
                    Tone.canvas.injectLayerColor('display', skritter.settings.get('gradingColors')[1]);
                }
            }
            if (this.review.character().isFinished())
                this.showAnswer();
        },
        /**
         * @method handleTap
         * @param {Object} event
         */
        handleTap: function(event) {
            this.handleGradingSelected(Prompt.gradingButtons.grade());
            event.preventDefault();
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
        },
        /**
         * @method showAnswer
         */
        showAnswer: function() {
            skritter.timer.stop();
            Tone.canvas.disableInput();
            this.$('#writing-area').hammer().on('tap', _.bind(this.handleTap, this));
            this.$('#prompt-reading').html(this.review.baseVocab().readingBlocks(this.review.get('position') + 1));
            Prompt.gradingButtons.show();
        }
    });

    return Tone;
});