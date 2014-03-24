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
            Rune.maxStrokeAttempts = 3;
            Rune.strokeAttempts = 0;
            skritter.timer.setReviewLimit(30);
            skritter.timer.setThinkingLimit(15);
            this.listenTo(Rune.canvas, 'input:down', this.handleStrokeDown);
            this.listenTo(Rune.canvas, 'input:up', this.handleStrokeReceived);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateRune);
            Prompt.prototype.render.call(this);
            Rune.canvas.setElement(this.$('#writing-area')).render();
            Rune.canvas.enableInput();
            this.$('#writing-area').hammer().off('tap', _.bind(this.handleTap, this));
            this.$('#writing-area').hammer().on('doubletap', _.bind(this.handleDoubleTap, this));
            this.$('#prompt-definition').html(this.review.baseVocab().get('definitions').en);
            this.$('#prompt-reading').html(this.review.baseVocab().reading());
            this.$('#prompt-sentence').html(this.review.baseVocab().sentenceMaskWriting());
            this.$('#prompt-style').html(this.review.baseVocab().style());
            this.$('#prompt-writing').html(this.review.baseVocab().writingBlocks(this.review.get('position')));
            skritter.timer.start();
            this.resize();
            return this;
        },
        /**
         * @method handleDoubleTap
         * @param {Object} event
         */
        handleDoubleTap: function(event) {
            Prompt.gradingButtons.grade(1);
            Rune.canvas.drawShape('background', this.review.character().targets[0].shape(null, '#999999'));
            event.preventDefault();
        },
        /**
         * @method handleStrokeDown
         */
        handleStrokeDown: function() {
            skritter.timer.stopThinking();
        },
        /**
         * @method handleStrokeReceived
         * @param {Array} points
         * @param {CreateJS.Shape} shape
         */
        handleStrokeReceived: function(points, shape) {
            if (points.length > 5) {
                Rune.canvas.fadeLayer('background');
                var result = this.review.character().recognize(points, shape);
                if (result) {
                    Rune.strokeAttempts = 0;
                    Rune.canvas.tweenShape('display', result.userShape(), result.inflateShape());
                } else {
                    Rune.strokeAttempts++;
                    Rune.canvas.fadeShape('marker', shape);
                    if (Rune.strokeAttempts > Rune.maxStrokeAttempts) {
                        Prompt.gradingButtons.grade(1);
                        Rune.canvas.fadeShape('hint', this.review.character().expectedStroke().inflateShape(skritter.settings.get('hintColor')));
                    }
                }
            }
            if (this.review.character().isFinished())
                this.showAnswer();
        },
        /**
         * @method remove
         */
        remove: function() {
            Rune.canvas.remove();
            Prompt.prototype.remove.call(this);
        },
        /**
         * @method resize
         */
        resize: function() {
            Prompt.prototype.resize.call(this);
            Rune.canvas.render();
            Rune.canvas.resize(skritter.settings.canvasSize());
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
            Rune.canvas.disableInput();
            Rune.canvas.injectLayerColor('display', skritter.settings.get('gradingColors')[Prompt.gradingButtons.grade()]);
            Rune.strokeAttempts = 0;
            window.setTimeout(_.bind(function() {
                this.$('#writing-area').hammer().one('tap', _.bind(this.handleTap, this));
            }, this), 500);
            this.$('#prompt-sentence').html(this.review.baseVocab().sentenceWriting());
            this.$('#prompt-writing').html(this.review.baseVocab().writingBlocks(this.review.get('position') + 1));
            Prompt.gradingButtons.show();
            Prompt.answerShown = true;
        }
    });

    return Rune;
});