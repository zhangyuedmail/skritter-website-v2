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
            skritter.timer.setReviewLimit(30);
            skritter.timer.setThinkingLimit(15);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateDefn);
            Prompt.prototype.render.call(this);
            this.$('#prompt-text').on('vclick', _.bind(this.handleClick, this));
            this.$('.button-toggle-hint').on('vclick', _.bind(this.toggleHint, this));
            this.resize();
            this.show();
            return this;
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
                    //height: contentHeight * 0.7,
                    //'max-height': '30%',
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
            event.preventDefault();
        }
    });

    return Defn;
});