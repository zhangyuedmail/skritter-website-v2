define([
    'require.text!template/prompt-tone.html',
    'view/prompt/Canvas',
    'view/prompt/Prompt'
], function(template, Canvas, Prompt) {
    /**
     * @class PromptTone
     */
    var View = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            skritter.timer.setReviewLimit(15);
            skritter.timer.setThinkingLimit(10);
            this.canvas = new Canvas();
            this.finished = false;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(_.template(template, skritter.strings));
            Prompt.prototype.render.call(this);
            this.canvas.setElement('.canvas-container').render();
            this.listenTo(this.canvas, 'canvas:click', this.handleClick);
            this.listenTo(this.canvas, 'canvas:swipeup', this.handleSwipeUp);
            this.listenTo(this.canvas, 'input:down', this.handleStrokeDown);
            this.listenTo(this.canvas, 'input:up', this.handleStrokeUp);
            this.resize();
            this.show();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, Prompt.prototype.events, {
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
         * @method handleGradingSelected
         * @param {Number} score
         */
        handleGradingSelected: function(score) {
            this.canvas.injectLayerColor('stroke', skritter.settings.get('gradingColors')[score]);
            this.review.setReview('score', score);
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
        handleStrokeUp: function(points, shape) {
            var possibleTones = _.flatten(this.review.getBaseVocab().getTones(this.review.get('position')));
            if (points && points.length > 2) {
                var result = this.review.getCharacterAt().recognize(points, shape);
                if (result) {
                    if (possibleTones.indexOf(result.get('tone')) > -1) {
                        this.review.setReview('score', 3);
                        window.setTimeout(_.bind(function() {
                            this.canvas.tweenShape('stroke', result.getUserShape(), result.inflateShape());
                        }, this), 0);
                    } else {
                        this.review.setReview('score', 1);
                        this.review.getCharacter().reset();
                        this.review.getCharacter().add(this.review.getCharacter().targets[possibleTones[0] - 1].models);
                        window.setTimeout(_.bind(function() {
                            this.canvas.drawShape('stroke', this.review.getCharacter().getShape());
                        }, this), 0);
                    }
                }
            } else {
                if (possibleTones.indexOf(5) > -1) {
                    this.review.setReview('score', 3);
                    this.review.getCharacter().add(this.review.getCharacter().targets[4].models);
                    window.setTimeout(_.bind(function() {
                        this.canvas.drawShape('stroke', this.review.getCharacter().getShape());
                    }, this), 0);
                } else {
                    this.review.setReview('score', 1);
                    this.review.getCharacter().add(this.review.getCharacter().targets[possibleTones[0] - 1].models);
                    window.setTimeout(_.bind(function() {
                        this.canvas.drawShape('stroke', this.review.getCharacter().getShape());
                    }, this), 0);
                }
            }
            if (this.review.getCharacter().isFinished()) {
                this.showAnswer();
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
            Prompt.prototype.remove.call(this);
        },
        /**
         * @method reset
         * @returns {Backbone.View}
         */
        reset: function() {
            this.canvas.clear().enableInput();
            this.canvas.drawCharacterFromFont('background', this.vocab.getCharacters()[this.review.getPosition() -1], this.vocab.getFontName(), 0.5);
            this.review.getCharacter().reset();
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
            this.canvas.resize()
                    .clearLayer('background')
                    .clearLayer('stroke');
            this.canvas.drawCharacterFromFont('background', this.vocab.getCharacters()[this.review.getPosition() -1], this.vocab.getFontName(), 0.5);
            this.canvas.drawShape('stroke', this.review.getCharacter().getShape());
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
            this.resize();
            this.canvas.disableGrid();
            this.canvas.enableInput();
            this.review.setReview('started', true);
            this.elements.definition.html(this.vocab.getDefinition());
            this.elements.reading.html(this.vocab.getReading(this.review.getPosition(), true, skritter.user.isUsingZhuyin()));
            this.elements.sentence.html(this.vocab.getSentence() ? this.vocab.getSentence().writing : '');
            this.elements.writing.html(this.vocab.getWriting());
            if (this.vocab.getStyle()) {
                this.elements.style.text(this.vocab.getStyle().toUpperCase());
                this.elements.style.addClass(this.vocab.getStyle());
            }
            if (this.review.getReview().finished) {
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
            if (!this.review.getReview().finished) {
                this.review.setReview({
                    finished: true,
                    reviewTime: skritter.timer.getReviewTime(),
                    thinkingTime: skritter.timer.getThinkingTime()
                });
            } else {
                var tone = _.flatten(this.review.getBaseVocab().getTones(this.review.get('position')))[0];
                this.canvas.drawShape('stroke', this.review.getCharacter().targets[tone - 1].getShape(null, skritter.settings.get('gradingColors')[this.review.getReview().score]));
            }
            this.elements.reading.html(this.vocab.getReading(this.review.getPosition() + 1, true, skritter.user.isUsingZhuyin()));
            window.setTimeout(_.bind(function() {
                this.grading.select(this.review.getScore()).show();
                this.canvas.injectLayerColor('stroke', skritter.settings.get('gradingColors')[this.review.getReviewAt().score]);  
                if (skritter.user.isAudioEnabled() && this.review.getVocab().has('audio')) {
                    this.vocab.playAudio(this.review.getPosition());
                }
            }, this), 0);
            return this;
        }
    });

    return View;
});