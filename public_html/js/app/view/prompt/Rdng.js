define([
    'require.text!template/prompt-rdng.html',
    'view/prompt/Prompt'
], function(templateRdng, Prompt) {
    /**
     * @class Rdng
     */
    var Rdng = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            skritter.timer.setReviewLimit(30);
            skritter.timer.setThinkingLimit(15);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateRdng);
            Prompt.prototype.render.call(this);
            this.$('#prompt-text').on('vclick', _.bind(this.handleClick, this));
            this.resize();
            this.show();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'vclick #info-section': 'toggleHint'
        },
        /**
         * @method handleClick
         * @param {Object} event
         */
        handleClick: function(event) {
            if (this.review.get('finished')) {
                Prompt.gradingButtons.trigger('selected');
            } else {
                this.showAnswer();
            }
            event.preventDefault();
        },
        /**
         * @method remove
         */
        remove: function() {
            this.$('#prompt-text').off();
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
            if (skritter.settings.isPortrait()) {
                this.$('.prompt-container').addClass('portrait');
                this.$('.prompt-container').removeClass('landscape');
                this.$('.prompt-container').css({
                    height: '',
                    width: ''
                });
                this.$('#info-section').css({
                    height: '45px', 
                    'max-height': '30%',
                    width: ''
                });
                this.$('#input-section').css({
                    height: contentHeight - this.$('#info-section').height(),
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
                    'max-height': '',
                    width: ''
                });
                this.$('#input-section').css({
                    height: canvasSize,
                    left: '',
                    width: ''
                });
            }
            this.$('#prompt-writing').fitText(0.65, {maxFontSize: '128px'});
        },
        /**
         * @method show
         * @returns {Backbone.View}
         */
        show: function() {
            skritter.timer.start();
            this.review.set('finished', false);
            this.$('#answer').hide();
            this.$('#prompt-definition').html(this.review.getBaseVocab().getDefinition());
            this.$('#prompt-reading').html(this.review.getBaseVocab().getReading());
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
            this.review.set('finished', true);
            this.$('#question').hide();
            this.$('#answer').show('fade', 200);
            this.$('#question-text').html('Definition:');
            Prompt.gradingButtons.show().select(this.review.getReviewAt().score).expand();
            if (this.review.isLast() && skritter.user.settings.get('audio'))
                this.review.getBaseVocab().playAudio();
            return this;
        },
        /**
         * @method toggleHint
         * @param {Object} event
         */
        toggleHint: function(event) {
            var infoSection = this.$('#info-section');
            var promptHint = this.$('#prompt-hint');
            var promptHintText = this.$('#prompt-hint-text');
            var promptHintToggleButton = this.$('.button-toggle-hint');
            if (promptHint.hasClass('expanded')) {
                promptHint.removeClass('expanded');
                promptHint.addClass('collapsed');
                infoSection.animate({
                    height: 45
                }, function() {
                    promptHint.hide();
                    promptHintText.show();
                    promptHintToggleButton.addClass('fa-arrow-circle-down');
                    promptHintToggleButton.removeClass('fa-arrow-circle-up');
                });
            } else {
                promptHint.removeClass('collapsed');
                promptHint.addClass('expanded');
                promptHint.show();
                promptHintText.hide();
                infoSection.animate({
                    height: infoSection[0].scrollHeight + 5
                }, function() {
                    promptHintToggleButton.addClass('fa-arrow-circle-up');
                    promptHintToggleButton.removeClass('fa-arrow-circle-down');
                });
            }
            event.preventDefault();
        }
    });
    
    return Rdng;
});