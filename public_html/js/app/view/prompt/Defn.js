define([
    'require.text!template/prompt-defn.html',
    'view/prompt/Prompt'
], function(templateDefn, Prompt) {
    /**
     * @class Defn
     */
    var Defn = Prompt.extend({
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
            skritter.timer.setReviewLimit(30);
            skritter.timer.setThinkingLimit(15);
            this.$el.html(templateDefn);
            Prompt.prototype.render.call(this);
            if (this.review.isFinished()) {
                this.show().showAnswer();
            } else {
                skritter.timer.start();
                this.show();
            }
            this.resize();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'vclick .navigate-forward': 'next',
            'vclick #prompt-text': 'handleClick',
            'vclick #info-section': 'toggleHint',
            'vclick #prompt-reading .reading': 'playAudio'
        },
        /**
         * @method handleClick
         * @param {Object} event
         */
        handleClick: function(event) {
            if (this.review.getReview().finished) {
                this.gradingButtons.triggerSelected();
            } else {
                this.showAnswer();
            }
            event.preventDefault();
        },
        /**
         * @method showHint
         */
        hideHint: function() {
            var promptHint = this.$('#prompt-hint');
            if (promptHint.hasClass('expanded')) {
                var infoSection = this.$('#info-section');
                var promptHintText = this.$('#prompt-hint-text');
                var promptHintToggleButton = this.$('.button-toggle-hint');
                promptHint.removeClass('expanded');
                promptHint.addClass('collapsed');
                infoSection.animate({
                    height: skritter.settings.isPortrait() ? 55 : skritter.settings.canvasSize()
                }, function() {
                    promptHint.hide();
                    promptHintText.show();
                    promptHintToggleButton.addClass('fa-chevron-down');
                    promptHintToggleButton.removeClass('fa-chevron-up');
                });
            }
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
                    height: '55px',
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
                    width: contentWidth - canvasSize
                });
                this.$('#input-section').css({
                    height: canvasSize,
                    left: '',
                    width: canvasSize
                });
            }
            this.$('#prompt-writing').fitText(0.65, {maxFontSize: '128px'});
        },
        /**
         * @method show
         * @returns {Backbone.View}
         */
        show: function() {
            this.$('#answer').hide();
            this.showNavigation();
            this.$('#prompt-definition').html(this.review.getBaseVocab().getDefinition());
            this.$('#prompt-newness').text(this.review.getBaseItem().isNew() ? 'new' : '');
            this.$('#prompt-reading').html(this.review.getBaseVocab().getReadingBlock(this.review.getBaseVocab().getCharacterCount() + 1));
            if (this.review.getBaseVocab().getSentence()) {
                this.$('#prompt-sentence').html(this.review.getBaseVocab().getSentence().getWriting());
            }
            this.$('#prompt-style').html(this.review.getBaseVocab().getStyle());
            this.$('#prompt-writing').html(this.review.getBaseVocab().get('writing'));
            if (this.review.getBaseVocab().has('audio')) {
                this.$('#prompt-reading .reading').addClass('has-audio');
            }
            return this;
        },
        /**
         * @method showAnswer
         * @returns {Backbone.View}
         */
        showAnswer: function() {
            skritter.timer.stop();
            this.showNavigation();
            if (!this.review.getReview().finished) {
                this.review.setReview({
                    finished: true,
                    reviewTime: skritter.timer.getReviewTime(),
                    thinkingTime: skritter.timer.getThinkingTime()
                });
            }
            this.$('#question').hide();
            this.$('#answer').show('fade', 200);
            this.$('#question-text').html('Definition:');
            this.showHint();
            this.gradingButtons.show().select(this.review.getReviewAt().score).expand();
            if (this.review.isLast() && skritter.user.settings.get('audio'))
                this.review.getBaseVocab().playAudio();
            return this;
        },
        /**
         * @method showHint
         */
        showHint: function() {
            var promptHint = this.$('#prompt-hint');
            if (promptHint.hasClass('collapsed')) {
                var infoSection = this.$('#info-section');
                var promptHintText = this.$('#prompt-hint-text');
                var promptHintToggleButton = this.$('.button-toggle-hint');
                promptHint.removeClass('collapsed');
                promptHint.addClass('expanded');
                promptHint.show();
                promptHintText.hide();
                infoSection.animate({
                    height: infoSection[0].scrollHeight + 5
                }, function() {
                    promptHintToggleButton.addClass('fa-chevron-up');
                    promptHintToggleButton.removeClass('fa-chevron-down');
                });
            }
        },
        /**
         * @method toggleHint
         * @param {Object} event
         */
        toggleHint: function(event) {
            if (this.$('#prompt-hint').hasClass('expanded')) {
                this.hideHint();
            } else {
                this.showHint();
            }
            event.preventDefault();
        }
    });

    return Defn;
});