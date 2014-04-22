define([
    'require.text!template/prompt-tone.html',
    'view/prompt/Canvas',
    'view/prompt/Prompt'
], function(templateTone, Canvas, Prompt) {
    /**
     * @class Tone
     */
    var Tone = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            skritter.timer.setReviewLimit(15);
            skritter.timer.setThinkingLimit(10);
            Tone.canvas = new Canvas();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateTone);
            Prompt.prototype.render.call(this);
            Tone.canvas.setElement(this.$('#writing-area'));
            this.$('#writing-area').hammer().on('tap', _.bind(this.handleTap, this));
            this.listenTo(Tone.canvas, 'input:down', this.handleStrokeDown);
            this.listenTo(Tone.canvas, 'input:up', this.handleStrokeReceived);
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
            Tone.canvas.render();
            return this;
        },
        /**
         * @method handleStrokeDown
         * @returns {undefined}
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
            var possibleTones = _.flatten(this.review.getBaseVocab().getTones(this.review.get('position')));
            if (points.length > 5) {
                var result = this.review.getCharacterAt().recognize(points, shape);
                if (result) {
                    if (possibleTones.indexOf(result.get('tone')) > -1) {
                        this.review.setReviewAt(null, 'score', 3);
                        Tone.canvas.tweenShape('display', result.getUserShape(), result.inflateShape());
                    } else {
                        this.review.setReviewAt(null, 'score', 1);
                        this.review.getCharacterAt().reset();
                        this.review.getCharacterAt().add(this.review.getCharacterAt().targets[possibleTones[0] - 1].models);
                        Tone.canvas.drawShape('display', this.review.getCharacterAt().getShape());
                    }
                }
            } else {
                if (possibleTones.indexOf(5) > -1) {
                    this.review.setReviewAt(null, 'score', 3);
                    this.review.getCharacterAt().add(this.review.getCharacterAt().targets[4].models);
                    Tone.canvas.drawShape('display', this.review.getCharacterAt().getShape());
                } else {
                    this.review.setReviewAt(null, 'score', 1);
                    this.review.getCharacterAt().add(this.review.getCharacterAt().targets[possibleTones[0] - 1].models);
                    Tone.canvas.drawShape('display', this.review.getCharacterAt().getShape());
                }
            }
            if (this.review.getCharacterAt().isFinished())
                this.showAnswer();
        },
        /**
         * @method handleTap
         * @param {Object} event
         */
        handleTap: function(event) {
            if (this.review.get('finished')) {
                Prompt.gradingButtons.trigger('selected');
            }
            event.preventDefault();
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
            Tone.canvas.resize(canvasSize).render();
            Tone.canvas.drawCharacterFromFont('background', this.review.getBaseVocab().getCharacters()[this.review.get('position') - 1], this.review.getBaseVocab().getFontName());
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
            if (this.review.getCharacterAt().isFinished())
                Tone.canvas.drawShape('display', this.review.getCharacterAt().getShape(null, skritter.settings.get('gradingColors')[this.review.getReviewAt().score]));
        },
        /**
         * @method show
         * @returns {Backbone.View}
         */
        show: function() {
            skritter.timer.start();
            Tone.canvas.enableInput();
            Tone.canvas.drawCharacterFromFont('background', this.review.getBaseVocab().getCharacters()[this.review.get('position') - 1], this.review.getBaseVocab().getFontName());
            this.review.set('finished', false);
            this.$('#prompt-definition').html(this.review.getBaseVocab().getDefinition());
            this.$('#prompt-reading').html(this.review.getBaseVocab().getReadingBlock(this.review.get('position'), skritter.user.settings.get('hideReading')));
            this.$('#prompt-sentence').html(this.review.getBaseVocab().getSentenceWriting());
            this.$('#prompt-style').html(this.review.getBaseVocab().getStyle());
            this.$('#prompt-writing').html(this.review.getBaseVocab().get('writing'));
            return this;
        },
        /**
         * @method showAnswer
         * @returns {Backbone.View}
         */
        showAnswer: function() {
            skritter.timer.stop();
            Tone.canvas.disableInput();
            Tone.canvas.injectLayerColor('display', skritter.settings.get('gradingColors')[this.review.getReviewAt().score]);
            this.review.set('finished', true);
            this.$('#prompt-reading').html(this.review.getBaseVocab().getReadingBlock(this.review.get('position') + 1, skritter.user.settings.get('hideReading')));
            Prompt.gradingButtons.show().select(this.review.getReviewAt().score).collapse();
            return this;
        }
    });
    
    return Tone;
});