define([], function() {
    /**
     * @class Prompt
     */
    var View = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.element = {};
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
            this.element.answer = this.$('.prompt-answer');
            this.element.canvas = this.$('.canvas-container');
            this.element.definition = this.$('.prompt-definition');
            this.element.heisig = this.$('.prompt-heisig');
            this.element.mnemonic = this.$('.prompt-mnemonic');
            this.element.question = this.$('.prompt-question');
            this.element.reading = this.$('.prompt-reading');
            this.element.sentence = this.$('.prompt-sentence');
            this.element.writing = this.$('.prompt-writing');
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
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
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
            this.remove();
            this.trigger('prompt:next');
        },
        /**
         * @method triggerPrevious
         */
        triggerPrevious: function() {
            this.remove();
            this.trigger('prompt:previous');
        }
    });

    return View;
});