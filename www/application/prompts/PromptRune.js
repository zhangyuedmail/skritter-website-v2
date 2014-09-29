/**
 * @module Application
 */
define([
    'prompts/Prompt',
    'require.text!templates/mobile/prompts/prompt-rune.html'
], function(Prompt, DesktopTemplate) {
    /**
     * @class PromptRune
     * @extends {Prompt}
     */
    var PromptRune = Prompt.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @param {PromptController} controller
         * @param {DataReview} review
         * @constructor
         */
        initialize: function(options, controller, review) {
            Prompt.prototype.initialize.call(this, options, controller, review);
            this.character = undefined;
            this.revealed = false;
            this.teaching = false;
        },
        /**
         * @method render
         * @returns {PromptRune}
         */
        render: function() {
            app.timer.setLimits(30, 15);
            this.$el.html(this.compile(DesktopTemplate));
            this.elements.toolbarEraser = this.$('#toolbar-eraser');
            this.elements.toolbarReveal = this.$('#toolbar-reveal');
            Prompt.prototype.render.call(this);
            this.canvas.showGrid().show();
            return this;
        },
        /**
         * @method renderAnswer
         * @returns {PromptRune}
         */
        renderAnswer: function() {
            Prompt.prototype.renderAnswer.call(this);
            this.canvas.disableInput();
            this.elements.fieldDefinition.html(this.vocab.getDefinition());
            this.elements.fieldReading.html(this.vocab.getReading(null, {
                hide: false,
                style: app.user.settings.get('readingStyle')
            }));
            this.elements.fieldWriting.html(this.vocab.getWriting(this.position + 1));
            return this;
        },
        /**
         * @method renderQuestion
         * @returns {PromptRune}
         */
        renderQuestion: function() {
            Prompt.prototype.renderQuestion.call(this);
            this.character = this.review.getCharacter();
            this.canvas.enableInput();
            this.elements.fieldDefinition.html(this.vocab.getDefinition());
            this.elements.fieldReading.html(this.vocab.getReading(null, {
                hide: app.user.settings.get('hideReading'),
                style: app.user.settings.get('readingStyle')
            }));
            this.elements.fieldWriting.html(this.vocab.getWriting(this.position));
            this.toggleToolbarEraser();
            if (app.user.settings.get('audio') && this.vocab.getAudio() && this.review.isFirst()) {
                app.assets.playAudio(this.vocab.getAudio());
            }
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, Prompt.prototype.events, {
            'vclick #toolbar-eraser': 'handleToolbarEraserClicked',
            'vclick #toolbar-reveal': 'handleToolbarRevealClicked',
            'vclick #toolbar-teach': 'handleToolbarTeachClicked'
        }),
        /**
         * @method handlePromptClicked
         */
        handleCanvasClicked: function() {
            if (this.review.getAt('answered')) {
                this.next();
            }
        },
        /**
         * @method handleInputUp
         */
        handleInputUp: function(points, shape) {
            if (points && points.length > 1 && shape) {
                var stroke = this.character.recognizeStroke(points, shape);
                if (stroke) {
                    this.toggleToolbarEraser();
                    this.canvas.lastMouseDownEvent = null;
                    this.canvas.tweenShape('stroke', stroke.getUserShape(), stroke.getShape());
                    if (this.character.isComplete()) {
                        this.canvas.fadeLayer('background', null);
                        this.revealed = false;
                        this.toggleToolbarReveal();
                        this.renderAnswer();
                    } else {
                        if (this.teaching) {
                            this.canvas.clearLayer('background');
                            this.teach();
                        } else {
                            this.canvas.fadeLayer('background', null);
                            this.revealed = false;
                            this.toggleToolbarReveal();
                        }
                    }
                }
            }
        },
        /**
         * @method handleToolbarEraserClicked
         * @param {Event} event
         */
        handleToolbarEraserClicked: function(event) {
            event.preventDefault();
            this.gradingButtons.hide();
            this.review.setAt('answered', false);
            if (this.character.length) {
                this.renderQuestion();
                this.character.reset();
                this.canvas.clearAll();
                this.revealed = false;
                this.toggleToolbarReveal();
            }
            this.toggleToolbarEraser();
        },
        /**
         * @method handleToolbarRevealClicked
         * @param {Event} event
         */
        handleToolbarRevealClicked: function(event) {
            event.preventDefault();
            if (this.revealed) {
                this.canvas.clearLayer('background');
                this.revealed = false;
            } else {
                this.revealCharacter();
                this.revealed = true;
            }
            this.toggleToolbarReveal();
        },
        /**
         * @method handleToolbarTeachClicked
         * @param {Event} event
         */
        handleToolbarTeachClicked: function(event) {
            event.preventDefault();
            this.review.setAt('score', 1);
            if (this.teaching) {
                this.canvas.fadeLayer('background', null);
                this.teaching = false;
            } else {
                this.teach();
            }
        },
        /**
         * @method reset
         * @returns {PromptRune}
         */
        reset: function() {
            Prompt.prototype.reset.call(this);
            this.canvas.clearAll();
            return this;
        },
        /**
         * @method resize
         * @returns {PromptRune}
         */
        resize: function() {
            Prompt.prototype.resize.call(this);
            var canvasSize = this.canvas.getWidth();
            var contentHeight = app.router.currentPage.getContentHeight();
            var contentWidth = app.router.currentPage.getContentWidth();
            this.elements.promptText.css('max-height', contentHeight - canvasSize - 36);
            if (app.isPortrait()) {
                this.$el.css({
                    'border-bottom': '1px solid #000000',
                    'border-right': 'none',
                    height: contentHeight - canvasSize - 1,
                    width: canvasSize
                });
            } else {
                this.$el.css({
                    'border-bottom': 'none',
                    'border-right': '1px solid #000000',
                    height: canvasSize,
                    width: contentWidth - canvasSize - 1
                });
            }
            return this;
        },
        /**
         * @method revealCharacter
         * @param {Number} [excludeStroke]
         */
        revealCharacter: function(excludeStroke) {
            this.canvas.clearLayer('background');
            this.canvas.drawShape('background', this.character.getExpectedVariations()[0].getShape(excludeStroke), {color: '#b3b3b3'});
            this.review.setAt('score', 1);
        },
        /**
         * @method teach
         * @returns {PromptRune}
         */
        teach: function() {
            var stroke = this.character.getExpectedStroke();
            var strokeParam = stroke.getParams()[0];
            var strokePath = strokeParam.get('corners');
            this.canvas.drawShape('background', stroke.getShape(), {color: '#b3b3b3'});
            this.canvas.tracePath('background', strokePath);
            this.teaching = true;
            return this;
        },
        /**
         * @method toggleToolbarEraser
         */
        toggleToolbarEraser: function() {
            if (this.character.length) {
                this.elements.toolbarEraser.removeClass('text-muted');
            } else {
                this.elements.toolbarEraser.addClass('text-muted');
            }
        },
        /**
         * @method toggleToolbarReveal
         */
        toggleToolbarReveal: function() {
            if (this.revealed) {
                this.elements.toolbarReveal.addClass('text-primary');
            } else {
                this.elements.toolbarReveal.removeClass('text-primary');
            }
        }
    });

    return PromptRune;
});