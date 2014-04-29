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
            skritter.timer.setReviewLimit(30);
            skritter.timer.setThinkingLimit(15);
            Rune.canvas = new Canvas();
            Rune.maxStrokeAttempts = 3;
            Rune.strokeAttempts = 0;
            Rune.teaching = false;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateRune);
            Prompt.prototype.render.call(this);
            Rune.canvas.setElement(this.$('#writing-area'));
            this.listenTo(Rune.canvas, 'canvas:click', this.handleClick);
            this.listenTo(Rune.canvas, 'canvas:taphold', this.handleTapHold);
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
            this.review.set('finished', false);
            return this;
        },
        /**
         * @method handleClick
         * @param {Object} event
         */
        handleClick: function(event) {
            if (this.review.get('finished')) {
                Prompt.gradingButtons.trigger('selected');
            }
            event.preventDefault();
        },
        /**
         * @method handleDoubleTap
         * @param {Object} event
         */
        handleDoubleTap: function(event) {
            if (!this.review.get('finished')) {
                this.review.setReviewAt(null, 'score', 1);
                Rune.canvas.drawShape('background', this.review.getCharacterAt().targets[0].getShape(null, '#999999'));
            }
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
                var result = this.review.getCharacterAt().recognize(points, shape);
                if (result) {
                    Rune.canvas.fadeLayer('background');
                    Rune.strokeAttempts = 0;
                    if (skritter.user.settings.get('squigs')) {
                        Rune.canvas.drawShape('display', shape);
                    } else {
                        Rune.canvas.tweenShape('display', result.getUserShape(), result.inflateShape());
                    }
                    if (this.review.getCharacterAt().isFinished()) {
                        this.showAnswer();
                    } else if (Rune.teaching) {
                        this.teach();
                    }
                } else {
                    Rune.strokeAttempts++;
                    Rune.canvas.fadeShape('marker', shape);
                    if (Rune.strokeAttempts > Rune.maxStrokeAttempts) {
                        this.review.setReviewAt(null, 'score', 1);
                        Rune.canvas.fadeShape('hint', this.review.getCharacterAt().getExpectedStroke().inflateShape(skritter.settings.get('hintColor')), 3000);
                    }
                }
            }
        },
        /**
         * @method handleTapHold
         * @param {Object} event
         */
        handleTapHold: function(event) {
            this.reset();
            event.preventDefault();
        },
        /**
         * @method remove
         */
        remove: function() {
            Rune.canvas.remove();
            this.$('#writing-area').off();
            Prompt.prototype.remove.call(this);
        },
        /**
         * @method reset
         * @returns {Backbone.View}
         */
        reset: function() {
            Rune.canvas.clear().enableInput();
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
                this.$('.prompt-container').css({
                    height: '',
                    width: ''
                });
                this.$('#info-section').css({
                    height: contentHeight - canvasSize + 10,
                    width: ''
                });
                this.$('#input-section').css({
                    height: canvasSize,
                    left: (contentWidth - canvasSize) / 2,
                    width: canvasSize
                });
            } else {
                this.$('.prompt-container').addClass('landscape');
                this.$('.prompt-container').removeClass('portrait');
                this.$('.prompt-container').css({
                    height: canvasSize,
                    width: ''
                });
                this.$('#info-section').css({
                    height: canvasSize,
                    width: ''
                });
                this.$('#info-section').css('height', canvasSize);
                this.$('#input-section').css({
                    height: canvasSize,
                    left: '',
                    width: canvasSize
                });
            }
            if (this.review.getCharacterAt().isFinished()) {
                Rune.canvas.drawShape('display', this.review.getCharacterAt().getShape(null, skritter.settings.get('gradingColors')[this.review.getReviewAt().score]));
            } else {
                Rune.canvas.drawShape('display', this.review.getCharacterAt().getShape());
                Rune.canvas.enableInput();
            }

        },
        /**
         * @method show
         * @returns {Backbone.View}
         */
        show: function() {
            skritter.timer.start();
            Rune.canvas.enableInput();
            this.review.set('finished', false);
            this.$('#prompt-definition').html(this.review.getBaseVocab().getDefinition());
            this.$('#prompt-reading').html(this.review.getBaseVocab().getReading());
            this.$('#prompt-sentence').html(this.review.getBaseVocab().getMaskedSentenceWriting());
            this.$('#prompt-style').html(this.review.getBaseVocab().getStyle());
            this.$('#prompt-writing').html(this.review.getBaseVocab().getWritingBlock(this.review.get('position')));
            if (skritter.user.settings.get('teachingMode') && this.review.getBaseItem().isNew())
                this.teach();
            if (this.review.isFirst() && skritter.user.settings.get('audio'))
                this.review.getBaseVocab().playAudio();
            return this;
        },
        /**
         * @method showAnswer
         * @returns {Backbone.View}
         */
        showAnswer: function() {
            skritter.timer.stop();
            Rune.canvas.disableInput();
            Rune.canvas.clearLayer('teach');
            this.review.set('finished', true);
            if (skritter.user.settings.get('squigs') && this.review.getCharacterAt().length > 0) {
                var color = skritter.settings.get('gradingColors')[this.review.getReviewAt().score];
                var character = this.review.getCharacterAt();
                for (var i = 0, length = character.length; i < length; i++) {
                    var stroke = character.at(i);
                    Rune.canvas.tweenShape('hint', stroke.getUserShape(color), stroke.inflateShape());
                }
                Rune.canvas.display().swapChildren(Rune.canvas.getLayer('display'), Rune.canvas.getLayer('hint'));
            } else {
                if (!Rune.teaching)
                    Rune.canvas.injectLayerColor('display', skritter.settings.get('gradingColors')[this.review.getReviewAt().score]);
            }
            this.$('#prompt-sentence').html(this.review.getBaseVocab().getSentenceWriting());
            this.$('#prompt-writing').html(this.review.getBaseVocab().getWritingBlock(this.review.get('position') + 1));
            if (Rune.teaching) {
                //TODO: handle what to show when finished and teaching
            } else {
                Prompt.gradingButtons.show().select(this.review.getReviewAt().score).collapse();
            }
            if (skritter.user.settings.get('audio'))
                this.review.getVocabAt().playAudio();
            return this;
        },
        /**
         * @method teach
         */
        teach: function() {
            var character = this.review.getCharacterAt();
            var stroke = character.getExpectedStroke();
            var strokeParams = stroke.inflateParams();
            this.review.setReviewAt(null, 'score', 1);
            Rune.teaching = true;
            Rune.canvas.clearLayer('teach').drawShape('teach', stroke.inflateShape('#999999'));
            Rune.canvas.drawArrow('teach', strokeParams[0].get('corners')[0], '#000000', '#fff79a', strokeParams[0].getStartingAngle());
        }
    });

    return Rune;
});