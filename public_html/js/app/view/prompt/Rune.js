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
            this.canvas = null;
            this.maxStrokeAttempts = 3;
            this.strokeAttempts = 0;
            this.teaching = false;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            skritter.timer.setReviewLimit(30);
            skritter.timer.setThinkingLimit(15);
            this.$el.html(templateRune);
            Prompt.prototype.render.call(this);
            this.canvas = new Canvas();
            this.canvas.setElement(this.$('#writing-area')).render();
            this.listenTo(this.canvas, 'canvas:click', this.handleClick);
            this.listenTo(this.canvas, 'canvas:clickhold', this.handleClickHold);
            this.listenTo(this.canvas, 'canvas:doubleclick', this.handleDoubleClick);
            this.listenTo(this.canvas, 'input:down', this.handleStrokeDown);
            this.listenTo(this.canvas, 'input:up', this.handleStrokeReceived);
            this.resize();
            if (this.review.get('finished')) {
                this.show().showAnswer();
            } else {
                skritter.timer.start();
                this.show();
            }
            return this;
        },
        /**
         * @method clear
         * @returns {Backbone.View}
         */
        clear: function() {
            this.gradingButtons.hide();
            this.canvas.render();
            this.review.set('finished', false);
            return this;
        },
        /**
         * @method handleClick
         * @param {Object} event
         */
        handleClick: function(event) {
            if (this.review.getReview().finished) {
                this.gradingButtons.triggerSelected();
            }
            event.preventDefault();
        },
        /**
         * @method handleClickHold
         * @param {Object} event
         */
        handleClickHold: function(event) {
            if (this.teaching) {
                this.reset();
                this.teach();
            } else {
                this.reset();
            }
            event.preventDefault();
        },
        /**
         * @method handleDoubleClick
         * @param {Object} event
         */
        handleDoubleClick: function(event) {
            if (!this.review.get('finished')) {
                this.review.setReviewAt(null, 'score', 1);
                this.canvas.drawShape('background', this.review.getCharacterAt().targets[0].getShape(null, '#999999'));
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
            if (points && points.length > 2) {
                var result = this.review.getCharacterAt().recognize(points, shape);
                if (result) {
                    this.canvas.fadeLayer('background');
                    this.strokeAttempts = 0;
                    if (skritter.user.settings.get('squigs')) {
                        this.canvas.drawShape('display', shape);
                    } else {
                        this.canvas.tweenShape('display', result.getUserShape(), result.inflateShape());
                    }
                    if (this.review.getCharacterAt().isFinished()) {
                        this.showAnswer();
                    } else if (this.teaching) {
                        this.teach();
                    }
                } else {
                    this.strokeAttempts++;
                    this.canvas.fadeShape('marker', shape);
                    if (this.strokeAttempts > this.maxStrokeAttempts) {
                        this.review.setReviewAt(null, 'score', 1);
                        this.canvas.fadeShape('hint', this.review.getCharacterAt().getExpectedStroke().inflateShape(skritter.settings.get('hintColor')), 3000);
                    }
                }
            } else {
                this.canvas.fadeShape('marker', shape);
            }
        },
        /**
         * @method remove
         */
        remove: function() {
            this.canvas.remove();
            this.$('#writing-area').off();
            Prompt.prototype.remove.call(this);
        },
        /**
         * @method reset
         * @returns {Backbone.View}
         */
        reset: function() {
            this.canvas.clear().enableInput();
            this.gradingButtons.hide();
            this.review.getCharacterAt().reset();
            this.review.set('finished', false);
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
            this.canvas.resize(canvasSize);
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
            if (this.review.getReview().finished) {
                this.canvas.drawShape('display', this.review.getCharacterAt().targets[0].getShape(null, skritter.settings.get('gradingColors')[this.review.getReviewAt().score]));
            } else {
                this.canvas.drawShape('display', this.review.getCharacterAt().getShape());
                this.canvas.enableInput();
            }
        },
        /**
         * @method show
         * @returns {Backbone.View}
         */
        show: function() {
            this.canvas.enableInput();
            this.$('#prompt-definition').html(this.review.getBaseVocab().getDefinition());
            this.$('#prompt-newness').text(this.review.getBaseItem().isNew() ? 'new' : '');
            this.$('#prompt-reading').html(this.review.getBaseVocab().getReading());
            this.$('#prompt-sentence').html(this.review.getBaseVocab().getMaskedSentenceWriting());
            this.$('#prompt-style').html(this.review.getBaseVocab().getStyle());
            this.$('#prompt-writing').html(this.review.getBaseVocab().getWritingBlock(this.review.get('position')));
            if (!this.review.getCharacterAt().isFinished() &&
                    skritter.user.settings.get('teachingMode') &&
                    this.review.getBaseItem().isNew()) {
                this.teach();
            }
            if (this.review.getBaseVocab().has('audio')) {
                this.$('#prompt-reading').addClass('has-audio');
            }
            if (this.review.isFirst() && skritter.user.settings.get('audio')) {
                this.review.getBaseVocab().playAudio();
            }
            return this;
        },
        /**
         * @method showAnswer
         * @returns {Backbone.View}
         */
        showAnswer: function() {
            skritter.timer.stop();
            this.canvas.disableInput();
            this.canvas.clearLayer('teach');
            this.review.setReview('finished', true);
            if (skritter.user.settings.get('squigs') && this.review.getCharacterAt().length > 0) {
                var color = skritter.settings.get('gradingColors')[this.review.getReviewAt().score];
                var character = this.review.getCharacterAt();
                for (var i = 0, length = character.length; i < length; i++) {
                    var stroke = character.at(i);
                    this.canvas.tweenShape('hint', stroke.getUserShape(color), stroke.inflateShape());
                }
                this.canvas.display().swapChildren(this.canvas.getLayer('display'), this.canvas.getLayer('hint'));
            } else {
                if (!this.teaching)
                    this.canvas.injectLayerColor('display', skritter.settings.get('gradingColors')[this.review.getReviewAt().score]);
            }
            this.$('#prompt-sentence').html(this.review.getBaseVocab().getSentenceWriting());
            this.$('#prompt-writing').html(this.review.getBaseVocab().getWritingBlock(this.review.get('position') + 1));
            if (this.teaching) {
                this.gradingButtons.grade(this.review.getReviewAt().score);
            } else {
                this.gradingButtons.show().select(this.review.getReviewAt().score).collapse();
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
            this.review.setReviewAt(null, {score: 1, taught: true});
            this.teaching = true;
            this.canvas.clearLayer('teach').drawShape('teach', stroke.inflateShape('#999999'));
            this.canvas.drawArrow('teach', strokeParams[0].get('corners')[0], '#000000', '#fff79a', strokeParams[0].getStartingAngle());
        }
    });

    return Rune;
});