define([
    'require.text!template/prompt-rune.html',
    'view/prompt/Canvas',
    'view/prompt/Prompt',
    'view/prompt/TeachingButtons'
], function(template, Canvas, Prompt, TeachingButtons) {
    /**
     * @class PromptRune
     */
    var View = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            skritter.timer.setReviewLimit(30);
            skritter.timer.setThinkingLimit(15);
            this.canvas = new Canvas();
            this.characterRevealed = false;
            this.maxStrokeAttempts = 3;
            this.strokeAttempts = 0;
            this.teaching = false;
            this.teachingButtons = new TeachingButtons();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(_.template(template, skritter.strings));
            Prompt.prototype.render.call(this);
            this.canvas.setElement('.canvas-container').render();
            this.teachingButtons.setElement('.teaching-container').render();
            this.listenTo(this.canvas, 'canvas:click', this.handleClick);
            this.listenTo(this.canvas, 'canvas:clickhold', this.handleClickHold);
            this.listenTo(this.canvas, 'canvas:swipeup', this.handleSwipeUp);
            this.listenTo(this.canvas, 'input:down', this.handleStrokeDown);
            this.listenTo(this.canvas, 'input:up', this.handleStrokeUp);
            this.listenTo(this.teachingButtons, 'next', this.next);
            this.listenTo(this.teachingButtons, 'repeat', this.reset);
            this.resize();
            this.show();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, Prompt.prototype.events, {
                'vclick .button-reveal': 'handleRevealClick'
            });
        },
        /**
         * @method clear
         * @returns {Backbone.View}
         */
        clear: function() {
            this.canvas.clear();
            Prompt.prototype.clear.call(this);
            return this;
        },
        /**
         * @method handleClick
         * @param {Object} event
         */
        handleClick: function(event) {
            if (this.review.isFinished()) {
                this.next();
            } else {
                skritter.timer.stopThinking();
            }
            event.preventDefault();
        },
        /**
         * @method handleClickHold
         * @param {Object} event
         */
        handleClickHold: function(event) {
            event.preventDefault();
        },
        /**
         * @method handleGradingSelected
         * @param {Number} score
         */
        handleGradingSelected: function(score) {
            if (skritter.user.settings.get('squigs')) {
                this.canvas.injectLayerColor('background', skritter.settings.get('gradingColors')[score]);
            } else {
                this.canvas.injectLayerColor('stroke', skritter.settings.get('gradingColors')[score]);
            }
            this.review.setReview('score', score);
        },
        /**
         * @method handleRevealClick
         * @param {Object} event
         */
        handleRevealClick: function(event) {
            this.review.setReview('score', 1);
            if (this.characterRevealed) {
                this.elements.reveal.removeClass('selected');
                this.canvas.clearLayer('background');
                this.characterRevealed = false;
            } else {
                this.elements.reveal.addClass('selected');
                this.revealCharacter();
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
         * @method handleStrokeUp
         * @param {Array} points
         * @param {CreateJS.Shape} shape
         */
        handleStrokeUp: function(points, shape) {
            if (points && points.length > 2) {
                var result = this.review.getCharacterAt().recognize(points, shape);
                if (result) {
                    this.characterRevealed = false;
                    this.strokeAttempts = 0;
                    this.canvas.lastMouseDownEvent = null;
                    this.elements.reveal.removeClass('selected');
                    if (skritter.user.settings.get('squigs')) {
                        this.canvas.drawShape('stroke', shape);
                    } else {
                        this.canvas.tweenShape('stroke', result.getUserShape(), result.inflateShape());
                    }
                    if (this.review.getCharacter().isFinished()) {
                        this.canvas.clearLayer('teach');
                        this.showAnswer();
                    } else if (this.teaching) {
                        this.teach();
                    } else {
                        this.canvas.fadeLayer('background');
                    }
                    
                } else {
                    this.strokeAttempts++;
                    if (this.strokeAttempts > this.maxStrokeAttempts) {
                        this.review.setReview('score', 1);
                        this.canvas.fadeShape('hint', this.review.getCharacter().getExpectedStroke().inflateShape(), skritter.settings.get('hintColor'), 3000);
                    }
                    this.canvas.fadeShape('background', shape);
                }
            } else {
                this.review.setReview('score', 1);
                this.canvas.fadeShape('hint', this.review.getCharacter().getExpectedStroke().inflateShape(), skritter.settings.get('hintColor'), 3000);
            }
        },
        /**
         * @method handleSwipeUp
         * @param {Object} event
         */
        handleSwipeUp: function(event) {
            this.reset();
            event.preventDefault();
        },
        /**
         * @method remove
         */
        remove: function() {
            this.canvas.remove();
            this.teachingButtons.remove();
            Prompt.prototype.remove.call(this);
        },
        /**
         * @method revealCharacter
         * @param {Number} excludePosition
         */
        revealCharacter: function(excludePosition) {
            this.canvas.clearLayer('background');
            this.canvas.drawShape('background', this.review.getCharacter().targets[0].getShape(excludePosition), '#999999');
            this.characterRevealed = true;
        },
        /**
         * @method reset
         * @returns {Backbone.View}
         */
        reset: function() {
            this.canvas.clear().enableInput();
            this.elements.reveal.show().removeClass('selected');
            this.gradingButtons.hide();
            this.teachingButtons.hide();
            this.review.getCharacter().reset();
            if (this.teaching) {
                this.teach();
            }
            return this;
        },
        /**
         * @method resize
         */
        resize: function() {
            Prompt.prototype.resize.call(this);
            var canvasSize = skritter.settings.getCanvasSize();
            var contentHeight = skritter.settings.getContentHeight();
            var contentWidth = skritter.settings.getContentWidth();
            var infoSection, inputSection;
            this.canvas.resize().clearLayer('stroke');
            if (skritter.user.settings.get('squigs')) {
                this.canvas.drawShape('stroke', this.review.getCharacter().getSquig());
            } else {
                this.canvas.drawShape('stroke', this.review.getCharacter().getShape());
            }
            if (this.review.getReview().finished) {
                this.canvas.injectLayerColor('stroke', skritter.settings.get('gradingColors')[this.review.getReview().score]);
            }
            if (skritter.settings.isPortrait()) {
                inputSection = this.$('.input-section').css({
                    height: canvasSize,
                    float: 'none',
                    width: contentWidth
                });
                infoSection = this.$('.info-section').css({
                    height: contentHeight - canvasSize,
                    float: 'none',
                    width: contentWidth
                });
            } else {
                inputSection = this.$('.input-section').css({
                    height: canvasSize,
                    float: 'left',
                    width: canvasSize
                });
                infoSection = this.$('.info-section').css({
                    height: contentHeight,
                    float: 'left',
                    width: contentWidth - canvasSize
                });
            }
        },
        /**
         * @method show
         * @returns {Backbone.View}
         */
        show: function() {
            skritter.timer.start();
            this.canvas.enableInput();
            this.characterRevealed = false;
            this.elements.reveal.show().removeClass('selected');
            this.elements.definition.html(this.vocab.getDefinition());
            this.teachingButtons.hide();
            if (this.item.isNew()) {
                this.elements.newness.show();
                if (skritter.user.settings.get('teachingMode')) {
                    this.teach();
                } else {
                    this.teaching = false;
                }
            }
            if (skritter.user.settings.get('hideReading')) {
                this.elements.reading.html(this.vocab.getReading(this.review.getPosition(), false, skritter.user.isUsingZhuyin()));
            } else {
                this.elements.reading.html(this.vocab.getReading(null, null, skritter.user.isUsingZhuyin()));
            }
            this.elements.sentence.html(this.vocab.getSentence() ? this.vocab.getSentence().writing : '');
            this.elements.writing.html(this.vocab.getWriting(this.review.getPosition()));
            if (this.vocab.getStyle()) {
                this.elements.style.text(this.vocab.getStyle().toUpperCase());
                this.elements.style.addClass(this.vocab.getStyle());
            }
            if (skritter.user.isAudioEnabled() && this.vocab.has('audio')) {
                this.elements.reading.addClass('has-audio');
                if (this.review.isFirst()) {
                    this.vocab.playAudio();
                }
            }
            if (this.review.getReview().finished) {
                this.revealCharacter();
                this.showAnswer();
            } else {
                skritter.timer.start();
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
            this.characterRevealed = false;
            this.elements.reveal.hide();
            if (!this.review.getReview().finished) {
                this.review.setReview({
                    finished: true,
                    reviewTime: skritter.timer.getReviewTime(),
                    thinkingTime: skritter.timer.getThinkingTime()
                });
            } else {
                this.canvas.drawShape('stroke', this.review.getCharacter().targets[0].getShape());
            }
            if (skritter.user.settings.get('hideReading')) {
                this.elements.reading.html(this.vocab.getReading(this.review.getPosition() + 1, false, skritter.user.isUsingZhuyin()));
            }
            this.elements.writing.html(this.vocab.getWriting(this.review.getPosition() + 1));
            if (!this.teaching && skritter.user.settings.get('squigs') && this.review.getCharacter().length > 0) {
                var character = this.review.getCharacter();
                window.setTimeout(_.bind(function() {
                    for (var i = 0, length = character.length; i < length; i++) {
                        var stroke = character.at(i);
                        this.canvas.tweenShape('background', stroke.getUserShape(), stroke.inflateShape());
                    }
                    if (!this.teaching) {
                        this.canvas.injectLayerColor('background', skritter.settings.get('gradingColors')[this.review.getReview().score]);
                    }
                }, this), 0);
            } else {
                if (!this.teaching) {
                    this.canvas.injectLayerColor('stroke', skritter.settings.get('gradingColors')[this.review.getReview().score]);
                }
            }
            if (this.teaching) {
                this.teachingButtons.show();
            } else {
                this.gradingButtons.select(this.review.getScore()).show();
            }
            if (skritter.user.isAudioEnabled() && this.vocab.getContainedAt(this.review.getPosition()).has('audio')) {
                this.vocab.playAudio(this.review.getPosition());
            }
            return this;
        },
        /**
         * @method teach
         */
        teach: function() {
            this.teaching = true;
            this.elements.reveal.hide();
            this.review.setReview('score', 1);
            this.revealCharacter(this.review.getPosition() - 1);
            var character = this.review.getCharacterAt();
            var stroke = character.getExpectedStroke();
            this.canvas.clearLayer('teach').drawShape('teach', stroke.inflateShape(), skritter.settings.get('hintColor'));
        }
    });

    return View;
});