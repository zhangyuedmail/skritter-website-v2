define([
    'view/prompt/GradingButtons'
], function(GradingButtons) {
    /**
     * @class Prompt
     */
    var View = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.elements = {};
            this.grading = new GradingButtons();
            this.item = null;
            this.review = null;
            this.vocab = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            console.log(this.review.id, this.review.toJSON());
            this.grading.setElement('.grading-container').render();
            this.elements.answer = this.$('.prompt-answer');
            this.elements.canvas = this.$('.canvas-container');
            this.elements.definition = this.$('.prompt-definition');
            this.elements.heisig = this.$('.prompt-heisig');
            this.elements.mnemonic = this.$('.prompt-mnemonic');
            this.elements.navLeft = this.$('.navigate-left');
            this.elements.navRight = this.$('.navigate-right');
            this.elements.question = this.$('.prompt-question');
            this.elements.reading = this.$('.prompt-reading');
            this.elements.sentence = this.$('.prompt-sentence');
            this.elements.style = this.$('.prompt-style');
            this.elements.writing = this.$('.prompt-writing');
            this.$('.character-font').addClass(this.vocab.getFontClass());
            this.listenTo(this.grading, 'complete', this.next);
            this.listenTo(this.grading, 'selected', this.handleGradingSelected);
            this.listenTo(skritter.settings, 'resize', this.resize);
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'vclick .navigate-left': 'handleNavigateLeftClicked',
            'vclick .navigate-right': 'handleNavigateRightClicked',
            'vclick .prompt-reading .reading': 'playAudio'
        },
        /**
         * @method clear
         * @returns {Backbone.View}
         */
        clear: function() {
            this.show();
            return this;
        },
        /**
         * @method destroy
         */
        destroy: function() {
            var keys = _.keys(this);
            for (var key in keys) {
                this[keys[key]] = undefined;
            }
        },
        /**
         * @method handleNavigateLeftClicked
         * @param {Object} event
         */
        handleNavigateLeftClicked: function(event) {
            this.previous();
            event.preventDefault();
        },
        /**
         * @method handleNavigateRightClicked
         * @param {Object} event
         */
        handleNavigateRightClicked: function(event) {
            this.next();
            event.preventDefault();
        },
        /**
         * @method hideNavigation
         * @returns {Backbone.View}
         */
        hideNavigation: function() {
            this.hideNavigationLeft();
            this.hideNavigationRight();
            return this;
        },
        /**
         * @method hideNavigationLeft
         * @returns {Backbone.View}
         */
        hideNavigationLeft: function() {
            this.elements.navLeft.hide();
            return this;
        },
        /**
         * @method hideNavigationLeft
         * @returns {Backbone.View}
         */
        hideNavigationRight: function() {
            this.elements.navRight.hide();
            return this;
        },
        /**
         * @method next
         */
        next: function() {
            if (!this.review.getReview().finished) {
                this.showAnswer();
            } else if (this.review.next()) {
                this.clear();
            } else {
                this.review.save(_.bind(function() {
                    this.grading.hide(_.bind(this.triggerNext, this));
                }, this));
            }
        },
        /**
         * @method playAudio
         * @param {Object} event
         */
        playAudio: function(event) {
            if (this.vocab.has('audio')) {
                if (skritter.user.isChinese()) {
                    var filename = this.$(event.currentTarget).data('reading') + '.mp3';
                    skritter.assets.playAudio(filename.toLowerCase());
                } else {
                    this.vocab.playAudio();
                }
                event.stopPropagation();
            }
        },
        /**
         * @method previous
         */
        previous: function() {
            if (this.review.previous()) {
                this.clear();
            } else {
                this.grading.hide(_.bind(this.triggerPrevious, this));
            }
        },
        /**
         * @method remove
         */
        remove: function() {
            this.grading.remove();
            this.removeElements();
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
            this.destroy();
        },
        /**
         * @method removeElements
         * @returns {Object}
         */
        removeElements: function() {
            for (var i in this.elements) {
                this.elements[i].remove();
                this.elements[i] = undefined;
            }
            return this.elements;
        },
        /**
         * @method resize
         */
        resize: function() {
        },
        /**
         * @method set
         * @param {Backbone.Model} review
         * @returns {Backbone.View}
         */
        set: function(review) {
            this.review = review;
            this.item = review.getBaseItem();
            this.vocab = review.getBaseVocab();
            return this;
        },
        /**
         * @method triggerNext
         */
        triggerNext: function() {
            this.trigger('prompt:next');
        },
        /**
         * @method triggerPrevious
         */
        triggerPrevious: function() {
            this.trigger('prompt:previous');
        }
    });

    return View;
});