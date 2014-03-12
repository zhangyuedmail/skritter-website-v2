/**
 * @module Skritter
 * @submodule Views
 * @param GradingButtons
 * @author Joshua McFarland
 */
define([
    'views/prompts/GradingButtons'
], function(GradingButtons) {
    /**
     * @class Prompt
     */
    var Prompt = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.size = {};
            Prompt.colors = {
                1: '#f7977a',
                2: '#fff79a',
                3: '#82ca9d',
                4: '#8493ca'
            };
            Prompt.gradingButtons = new GradingButtons();
            Prompt.review = null;
            this.listenTo(skritter.settings, 'resize', this.resize);
            this.listenTo(Prompt.gradingButtons, 'selected', this.handleGradeSelected);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            Prompt.gradingButtons.setElement(this.$('#grading-container')).render();
            this.$('.navigation.left').hammer().on('tap', _.bind(this.back, this));
            this.$('.navigation.right').hammer().on('tap', _.bind(this.forward, this));
            this.resize();
            this.show();
            return this;
        },
        /**
         * @method back
         */
        back: function() {
            var position = Prompt.review.get('position');
            if (position === 1) {
                skritter.router.view.study.previousPrompt();
            } else {
                Prompt.review.set('position', position - 1);
                this.clear();
                this.show();
            }
        },
        /**
         * @method clear
         * @returns {Backbone.Model}
         */
        clear: function() {
            Prompt.gradingButtons.hide();
            return this;
        },
        /**
         * @method forward
         */
        forward: function() {
            var position = Prompt.review.get('position');
            if (position >= Prompt.review.max()) {
                skritter.router.view.study.nextPrompt();
            } else {
                Prompt.review.set('position', position + 1);
                this.clear();
                this.show();
            }
        },
        /**
         * @method handleGradeSelected
         * @param {Number} grade
         */
        handleGradeSelected: function(grade) {
            Prompt.review.position(Prompt.review.get('position')).score = grade;
            this.forward();
        },
        /**
         * @method hideDefinition
         * @returns {Backbone.View}
         */
        hideDefinition: function() {
            this.$('.prompt-definition').parent().hide();
            return this;
        },
        /**
         * @method hideMnemonic
         * @returns {Backbone.View}
         */
        hideMnemonic: function() {
            this.$('.prompt-mnemonic').parent().hide();
            return this;
        },
        /**
         * @method hideReading
         * @returns {Backbone.View}
         */
        hideReading: function() {
            this.$('.prompt-reading').parent().hide();
            return this;
        },
        /**
         * @method hideSentence
         * @returns {Backbone.View}
         */
        hideSentence: function() {
            this.$('.prompt-sentence').parent().hide();
            return this;
        },
        /**
         * @method hideWriting
         * @returns {Backbone.View}
         */
        hideWriting: function() {
            this.$('.prompt-writing').parent().hide();
            return this;
        },
        /**
         * @method resize
         * @param {Backbone.Model} settings
         */
        resize: function(settings) {
            if (settings.orientation() === 'landscape') {
                this.size.info = {
                    width: settings.width() - this.$('#input-container').width() - 2,
                    height: settings.height()
                };
            } else {
                this.size.info = {
                    width: settings.width(),
                    height: settings.height() - this.$('#input-container').height() - 2
                };
            }
            this.$('#info-container').width(this.size.info.width);
            this.$('#info-container').height(this.size.info.height);
        },
        /**
         * @method set
         * @param review
         * @returns {Backbone.View}
         */
        set: function(review) {
            console.log('PROMPT', review);
            Prompt.review = review;
            return this;
        },
        /**
         * @method showDefinition
         * @returns {Backbone.View}
         */
        showDefinition: function() {
            this.$('.prompt-definition').html(Prompt.review.vocab().definition());
            return this;
        },
        /**
         * @method showMnemonic
         * @returns {Backbone.View}
         */
        showMnemonic: function() {
            if (Prompt.review.vocab().has('mnemonic')) {
                this.$('.prompt-mnemonic').html(Prompt.review.vocab().mnemonic());
                this.$('.prompt-mnemonic').parent().show();
            } else {
                this.hide.mnemonic();
            }
            return this;
        },
        /**
         * @method showReading
         * @param {Number} offset
         * @param {Boolean} mask
         * @returns {Backbone.View}
         */
        showReading: function(offset, mask) {
            this.$('.prompt-reading').html(Prompt.review.vocab().reading(offset, mask));
            return this;
        },
        /**
         * @method showSentence
         * @returns {Backbone.View}
         */
        showSentence: function() {
            if (Prompt.review.vocab().has('sentenceId')) {
                this.$('.prompt-sentence').html(Prompt.review.vocab().sentence().get('writing'));
            } else {
                this.$('.prompt-sentence').parent().show();
            }
            return this;
        },
        /**
         * @method showWriting
         * @param {Number} offset
         * @returns {Backbone.View}
         */
        showWriting: function(offset) {
            this.$('.prompt-writing').html(Prompt.review.vocab().writing(offset));
            return this;
        }
    });

    return Prompt;
});