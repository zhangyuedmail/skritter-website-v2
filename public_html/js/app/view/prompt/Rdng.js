define([
    'require.text!template/prompt-rdng.html',
    'view/prompt/Prompt'
], function(template, Prompt) {
    /**
     * @class PromptRdng
     */
    var View = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(_.template(template, skritter.strings));
            Prompt.prototype.render.call(this);
            this.resize();
            this.show();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'vclick .prompt-reading .reading': 'playAudio',
            'vclick .prompt-text': 'handleClick'
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
                this.showAnswer();
            }
            event.preventDefault();
        },
        /**
         * @method remove
         */
        remove: function() {
            Prompt.prototype.remove.call(this);
        },
        /**
         * @method reset
         * @returns {Backbone.View}
         */
        reset: function() {
            this.canvas.clear().enableInput();
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
            this.elements.answer.hide();
            this.elements.definition.html(this.vocab.getDefinition());
            this.elements.reading.html(this.vocab.getReading(null, null, skritter.user.isUsingZhuyin()));
            this.elements.sentence.html(this.vocab.getSentence() ? this.vocab.getSentence().writing : '');
            this.elements.writing.html(this.vocab.getWriting());
            this.elements.question.show('slide', {direction: 'right'}, 300);
            if (this.vocab.getStyle()) {
                this.elements.style.text(this.vocab.getStyle().toUpperCase());
                this.elements.style.addClass(this.vocab.getStyle());
            }
            if (this.vocab.has('audio')) {
                this.elements.reading.addClass('has-audio');
            }
            if (this.review.getReview().finished) {
                this.showAnswer();
            }
            return this;
        },
        /**
         * @method showAnswer
         * @returns {Backbone.View}
         */
        showAnswer: function() {
            this.elements.question.hide();
            this.review.setReview({finished: true});
            this.elements.answer.fadeIn(300);
            window.setTimeout(_.bind(function() {
                this.grading.select(this.review.getScore()).show();
                if (skritter.user.isAudioEnabled() && this.vocab.has('audio')) {
                    this.vocab.playAudio();
                }
            }, this), 0);
            return this;
        }
    });

    return View;
});