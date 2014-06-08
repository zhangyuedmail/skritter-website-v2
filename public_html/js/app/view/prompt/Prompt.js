define([], function() {
    /**
     * @class Prompt
     */
    var View = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.elements = {};
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
            this.elements.answer = this.$('.prompt-answer');
            this.elements.canvas = this.$('.canvas-container');
            this.elements.definition = this.$('.prompt-definition');
            this.elements.heisig = this.$('.prompt-heisig');
            this.elements.mnemonic = this.$('.prompt-mnemonic');
            this.elements.question = this.$('.prompt-question');
            this.elements.reading = this.$('.prompt-reading');
            this.elements.sentence = this.$('.prompt-sentence');
            this.elements.writing = this.$('.prompt-writing');
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