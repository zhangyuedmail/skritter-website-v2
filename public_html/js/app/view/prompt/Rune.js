define([
    'require.text!template/prompt-rune.html',
    'view/prompt/Canvas',
    'view/prompt/Prompt'
], function(templateRune, Canvas, Prompt) {
    /**
     * @class Rune
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
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateRune);
            Prompt.prototype.render.call(this);
            Rune.canvas.setElement(this.$('#writing-area'));
            this.$('#writing-area').hammer().on('hold', _.bind(this.handleHold, this));
            this.listenTo(Rune.canvas, 'input:down', this.handleStrokeDown);
            this.listenTo(Rune.canvas, 'input:up', this.handleStrokeReceived);
            this.resize();
            this.show();
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
            //skritter.timer.stopThinking();
        },
        /**
         * @method handleStrokeReceived
         * @param {Array} points
         * @param {CreateJS.Shape} shape
         */
        handleStrokeReceived: function(points, shape) {
            if (points.length > 2) {
                var result = this.review.getCharacterAt().recognize(points, shape);
                if (result) {
                    Rune.canvas.fadeLayer('background');
                    Rune.strokeAttempts = 0;
                    if (skritter.user.settings.get('squigs')) {
                        Rune.canvas.drawShape('display', shape);
                    } else {
                        Rune.canvas.tweenShape('display', result.getUserShape(), result.inflateShape());
                    }
                } else {
                    Rune.strokeAttempts++;
                    Rune.canvas.fadeShape('marker', shape);
                    if (Rune.strokeAttempts > Rune.maxStrokeAttempts) {
                        this.review.getReviewAt({score: 1});
                        Rune.canvas.fadeShape('hint', this.review.getCharacterAt().getExpectedStroke().inflateShape(skritter.settings.get('hintColor')), 3000);
                    }
                }
            }
            if (this.review.getCharacterAt().isFinished())
                this.showAnswer();
        },
        /**
         * @method reset
         * @returns {Backbone.View}
         */
        reset: function() {
            Rune.canvas.disableInput().enableInput();
            Rune.canvas.render();
            Prompt.gradingButtons.hide();
            this.review.getCharacterAt().reset();
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
            Rune.canvas.resize(canvasSize).render();
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
        },
        /**
         * @method show
         * @returns {Backbone.View}
         */
        show: function() {
            Rune.canvas.enableInput();
            this.$('#prompt-definition').html(this.review.getBaseVocab().getDefinition());
            this.$('#prompt-reading').html(this.review.getBaseVocab().getReading());
            this.$('#prompt-sentence').html(this.review.getBaseVocab().getMaskedSentenceWriting());
            this.$('#prompt-style').html(this.review.getBaseVocab().getStyle());
            this.$('#prompt-writing').html(this.review.getBaseVocab().getWritingBlock(this.review.get('position')));
            return this;
        },
        /**
         * @method showAnswer
         * @returns {Backbone.View}
         */
        showAnswer: function() {
            Rune.canvas.disableInput();
            if (skritter.user.settings.get('squigs') && this.review.getCharacterAt().length > 0) {
                var color = skritter.settings.get('gradingColors')[this.review.getReviewAt().score];
                var character = this.review.getcCharacterAt();
                for (var i = 0, length = character.length; i < length; i++) {
                    var stroke = character.at(i);
                    Rune.canvas.tweenShape('hint', stroke.getUserShape(color), stroke.inflateShape());
                }
                Rune.canvas.display().swapChildren(Rune.canvas.getLayer('display'), Rune.canvas.getLayer('hint'));
            } else {
                Rune.canvas.injectLayerColor('display', skritter.settings.get('gradingColors')[this.review.getReviewAt().score]);
            }
            this.$('#prompt-sentence').html(this.review.getBaseVocab().getSentenceWriting());
            this.$('#prompt-writing').html(this.review.getBaseVocab().getWritingBlock(this.review.get('position') + 1));
            Prompt.gradingButtons.show().select(this.review.getReviewAt().score).collapse();
            return this;
        }
    });
    
    return Rune;
});