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
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateRune);
            Prompt.prototype.render.call(this);
            Rune.canvas.setElement(this.$('#writing-area')).render();
            this.$('#writing-area').hammer().on('hold', _.bind(this.handleHold, this));
            this.listenTo(Rune.canvas, 'input:down', this.handleStrokeDown);
            this.listenTo(Rune.canvas, 'input:up', this.handleStrokeReceived);
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
            Rune.canvas.render();
            return this;
        },
        /**
         * @method handleDoubleTap
         * @param {Object} event
         */
        handleDoubleTap: function(event) {
            if (!this.review.character().isFinished()) {
                this.review.at({score: 1});
                Rune.canvas.drawShape('background', this.review.character().targets[0].shape(null, '#999999'));
            }
            event.preventDefault();
        },
        /**
         * @method handleHold
         * @param {Object} event
         */
        handleHold: function(event) {
            this.reset();
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
            if (points.length > 2) {
                var result = this.review.character().recognize(points, shape);
                if (result) {
                    Rune.canvas.fadeLayer('background');
                    Rune.strokeAttempts = 0;
                    if (skritter.user.settings.get('squigs')) {
                        Rune.canvas.drawShape('display', shape);
                    } else {
                        Rune.canvas.tweenShape('display', result.userShape(), result.inflateShape());
                    }
                } else {
                    Rune.strokeAttempts++;
                    Rune.canvas.fadeShape('marker', shape);
                    if (Rune.strokeAttempts > Rune.maxStrokeAttempts) {
                        this.review.at({score: 1});
                        Rune.canvas.fadeShape('hint', this.review.character().expectedStroke().inflateShape(skritter.settings.get('hintColor')), 3000);
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
            this.$('#writing-area').hammer().off();
            Prompt.prototype.remove.call(this);
        },
        /**
         * @method reset
         * @returns {Backbone.View}
         */
        reset: function() {
            Rune.canvas.disableInput().enableInput();
            Rune.canvas.render();
            Prompt.gradingButtons.hide();
            this.review.character().reset();
            return this;
        },
        /**
         * @method resize
         */
        resize: function() {
            Prompt.prototype.resize.call(this);
            var canvasSize = skritter.settings.canvasSize();
            var contentHeight = skritter.settings.contentHeight();
            var contentWidth = skritter.settings.contentWidth();
            Rune.canvas.render().resize(canvasSize);
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
                Rune.canvas.drawShape('display', this.review.character().shape(null, skritter.settings.get('gradingColors')[this.review.at().score]));
            } else if (this.review.character().length > 0) {
                Rune.canvas.drawShape('display', this.review.character().shape());
            }
        },
        /**
         * @method show
         * @returns {Backbone.View}
         */
        show: function() {
            skritter.timer.start();
            Rune.canvas.enableInput();
            this.$('#writing-area').hammer().off('tap', _.bind(this.handleTap, this));
            this.$('#writing-area').hammer().on('doubletap', _.bind(this.handleDoubleTap, this));
            this.$('#writing-area').hammer().on('hold', _.bind(this.handleHold, this));
            this.$('#prompt-definition').html(this.review.baseVocab().definition());
            if (this.review.baseItem().isNew())
                this.$('#prompt-new-tag').show();
            this.$('#prompt-reading').html(this.review.baseVocab().reading());
            this.$('#prompt-sentence').html(this.review.baseVocab().sentenceMaskWriting());
            this.$('#prompt-style').html(this.review.baseVocab().style());
            this.$('#prompt-writing').html(this.review.baseVocab().writingBlocks(this.review.get('position')));
            if (skritter.user.settings.get('audio') && this.review.isFirst() && !this.review.get('audioPlayed')) {
                this.review.baseVocab().playAudio();
                this.review.set('audioPlayed', true);
            }
            return this;
        },
        /**
         * @method showAnswer
         * @returns {Backbone.View}
         */
        showAnswer: function() {
            skritter.timer.stop();
            Rune.canvas.disableInput();
            if (skritter.user.settings.get('squigs') && this.review.character().length > 0) {
                var color = skritter.settings.get('gradingColors')[this.review.at().score];
                for (var i = 0, length = this.review.character().length; i < length; i++) {
                    var stroke = this.review.character().at(i);
                    Rune.canvas.tweenShape('hint', stroke.userShape(color), stroke.inflateShape());
                }
                Rune.canvas.display().swapChildren(Rune.canvas.getLayer('display'), Rune.canvas.getLayer('hint'));
            } else {
                Rune.canvas.injectLayerColor('display', skritter.settings.get('gradingColors')[this.review.at().score]);
            }
            Rune.strokeAttempts = 0;
            window.setTimeout(_.bind(function() {
                this.$('#writing-area').hammer().off('doubletap', _.bind(this.handleDoubleTap, this));
                this.$('#writing-area').hammer().one('tap', _.bind(this.handleTap, this));
            }, this), 500);
            this.$('#prompt-sentence').html(this.review.baseVocab().sentenceWriting());
            this.$('#prompt-writing').html(this.review.baseVocab().writingBlocks(this.review.get('position') + 1));
            Prompt.gradingButtons.show().select(this.review.at().score).collapse();
            return this;
        }
    });

    return Rune;
});