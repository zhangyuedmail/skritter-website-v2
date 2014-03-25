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
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateTone);
            Prompt.prototype.render.call(this);
            Tone.canvas.setElement(this.$('#writing-area')).render();
            this.listenTo(Tone.canvas, 'input:down', this.handleStrokeDown);
            this.listenTo(Tone.canvas, 'input:up', this.handleStrokeReceived);
            this.resize();
            if (this.review.character().isFinished()) {
                this.show().showAnswer();
            } else {
                this.show();
            }
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
                        Prompt.gradingButtons.grade(3);
                    } else {
                        this.review.character().reset();
                        this.review.character().add(this.review.character().targets[possibleTones[0] - 1].models);
                        Tone.canvas.drawShape('display', this.review.character().shape());
                        Prompt.gradingButtons.grade(1);
                    }
                }
            } else {
                
                if (possibleTones.indexOf(5) > -1) {
                    this.review.character().add(this.review.character().targets[4].models);
                    Tone.canvas.drawShape('display', this.review.character().shape());
                    Prompt.gradingButtons.grade(3);
                } else {
                    this.review.character().add(this.review.character().targets[possibleTones[0] - 1].models);
                    Tone.canvas.drawShape('display', this.review.character().shape());
                    Prompt.gradingButtons.grade(1);
                }
            }
            if (this.review.character().isFinished())
                this.showAnswer();
        },
        /**
         * @method remove
         */
        remove: function() {
            Tone.canvas.remove();
            this.$('#writing-area').hammer().off();
            Prompt.prototype.remove.call(this);
        },
        /**
         * @method resize
         */
        resize: function() {
            Prompt.prototype.resize.call(this);
            Tone.canvas.render().resize(skritter.settings.canvasSize());
            Tone.canvas.drawCharacterFromFont('background', this.review.baseVocab().characters()[this.review.get('position') - 1], skritter.user.settings.font());
            this.$('#top-container').height(skritter.settings.contentHeight() - skritter.settings.canvasSize() - 3);
            this.$('#top-container').width(skritter.settings.contentWidth());
            this.$('#bottom-container').height(skritter.settings.contentHeight() - this.$('#top-container').height() - 3);
            this.$('#bottom-container').width(skritter.settings.contentWidth());
            this.$('#writing-area').width(skritter.settings.canvasSize());
            if (this.review.character().isFinished()) {
                Tone.canvas.drawShape('display', this.review.character().shape(null, skritter.settings.get('gradingColors')[Prompt.gradingButtons.grade()]));
                Tone.canvas.getLayer('background').alpha = 0.6;
            }
        },
        /**
         * @method show
         * @returns {Backbone.View}
         */
        show: function() {
            skritter.timer.start();
            Tone.canvas.enableInput();
            this.$('#writing-area').hammer().off('tap', _.bind(this.handleTap, this));
            this.$('#prompt-definition').html(this.review.baseVocab().get('definitions').en);
            if (this.review.baseItem().isNew())
                this.$('#prompt-new-tag').show();
            this.$('#prompt-reading').html(this.review.baseVocab().readingBlocks(this.review.get('position'), skritter.user.settings.get('hideReading')));
            this.$('#prompt-sentence').html(this.review.baseVocab().sentenceWriting());
            this.$('#prompt-style').html(this.review.baseVocab().style());
            this.$('#prompt-writing').html(this.review.baseVocab().get('writing'));
            return this;
        },
        /**
         * @method showAnswer
         * @returns {Backbone.View}
         */
        showAnswer: function() {
            skritter.timer.stop();
            Tone.canvas.disableInput();
            Tone.canvas.getLayer('background').alpha = 0.6;
            Tone.canvas.injectLayerColor('display', skritter.settings.get('gradingColors')[Prompt.gradingButtons.grade()]);
            window.setTimeout(_.bind(function() {
               this.$('#writing-area').hammer().one('tap', _.bind(this.handleTap, this)); 
            }, this), 500);
            this.$('#prompt-reading').html(this.review.baseVocab().readingBlocks(this.review.get('position') + 1));
            Prompt.gradingButtons.show();
            return this;
        }
    });

    return Tone;
});