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
         * @method clear
         * @returns {Backbone.View}
         */
        clear: function() {
            Prompt.gradingButtons.hide();
            Tone.canvas.render();
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
                        this.review.at({score: 1});
                        Tone.canvas.tweenShape('display', result.userShape(), result.inflateShape());
                        Prompt.gradingButtons.grade(3);
                    } else {
                        this.review.at({score: 1});
                        this.review.character().reset();
                        this.review.character().add(this.review.character().targets[possibleTones[0] - 1].models);
                        Tone.canvas.drawShape('display', this.review.character().shape());
                        Prompt.gradingButtons.grade(1);
                    }
                }
            } else {
                if (possibleTones.indexOf(5) > -1) {
                    this.review.at({score: 1});
                    this.review.character().add(this.review.character().targets[4].models);
                    Tone.canvas.drawShape('display', this.review.character().shape());
                    Prompt.gradingButtons.grade(3);
                } else {
                    this.review.at({score: 1});
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
            var canvasSize = skritter.settings.canvasSize();
            var contentHeight = skritter.settings.contentHeight();
            var contentWidth = skritter.settings.contentWidth();
            Tone.canvas.render().resize(canvasSize);
            Tone.canvas.drawCharacterFromFont('background', this.review.baseVocab().characters()[this.review.get('position') - 1], skritter.user.settings.font());
            if (skritter.settings.isPortrait()) {
                this.$('.prompt-container').addClass('portrait');
                this.$('.prompt-container').removeClass('landscape');
                this.$('#info-section').css('height', contentHeight - canvasSize + 5);
                this.$('#input-section').css('left', (contentWidth - canvasSize) / 2);
            } else {
                this.$('.prompt-container').addClass('landscape');
                this.$('.prompt-container').removeClass('portrait');
                this.$('#input-section').css('left', '');
            }
            this.$('#input-section').height(canvasSize);
            this.$('#input-section').width(canvasSize);
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
            Tone.canvas.drawCharacterFromFont('background', this.review.baseVocab().characters()[this.review.get('position') - 1], skritter.user.settings.font());
            this.$('#writing-area').hammer().off('tap', _.bind(this.handleTap, this));
            this.$('#prompt-definition').html(this.review.baseVocab().definition());
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
            if (skritter.user.settings.get('audio') && this.review.isLast())
                this.review.baseVocab().playAudio();
            return this;
        }
    });

    return Tone;
});