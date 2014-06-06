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
            this.position = 1;
            this.review = null;
            this.targetCharacter = null;
            this.targetReview = null;
            this.vocab = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            console.log(this.review.get('itemId'), this.review.attributes);
            this.element.definition = this.$('.prompt-definition');
            this.element.heisig = this.$('.prompt-heisig');
            this.element.mnemonic = this.$('.prompt-mnemonic');
            this.element.reading = this.$('.prompt-reading');
            this.element.sentence = this.$('.prompt-sentence');
            this.element.writing = this.$('.prompt-writing');
            this.listenTo(skritter.settings, 'resize', this.resize);
            return this;
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
            //TODO: add global resizing
        },
        /**
         * @method set
         * @param {Backbone.Model} review
         * @returns {Backbone.View}
         */
        set: function(review) {
            this.review = review;
            this.item = review.getBaseItem();
            this.targetCharacter = null;
            this.targetReview = null;
            this.vocab = review.getBaseVocab();
            return this;
        }
    });

    return View;
});