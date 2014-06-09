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
            this.elements.question = this.$('.prompt-question');
            this.elements.reading = this.$('.prompt-reading');
            this.elements.sentence = this.$('.prompt-sentence');
            this.elements.style = this.$('.prompt-style');
            this.elements.writing = this.$('.prompt-writing');
            this.$('.character-font').addClass(this.vocab.getFontClass());
            this.listenTo(skritter.settings, 'resize', this.resize);
            return this;
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
         * @method next
         */
        next: function() {
            if (this.review.next()) {
                this.clear();
            } else {
                this.review.save(_.bind(this.triggerNext, this));
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
                this.triggerPrevious();
            }
        },
        /**
         * @method remove
         */
        remove: function() {
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