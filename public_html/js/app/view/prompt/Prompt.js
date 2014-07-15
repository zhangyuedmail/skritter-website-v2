define([
    'view/View'
], function(View) {
    /**
     * @class Prompt
     */
    var Prompt = View.extend({
        /**
         * @method initialize
         */
        initialize: function(container) {
            this.canvas = null;
            this.container = container;
            this.review = null;
            this.vocab = null;
        },
        /**
         * @method clear
         * @param {Prompt}
         */
        clear: function() {
            this.container.$('.prompt-field').text('');
            return this;
        },
        /**
         * @method handleClickCanvas
         * @param {Object} event
         */
        handleClickCanvas: function(event) {
            event.preventDefault();
        },
        /**
         * @method handleClickHoldCanvas
         * @param {Object} event
         */
        handleClickHoldCanvas: function(event) {
            event.preventDefault();
        },
        /**
         * @method handleDoubleClickCanvas
         * @param {Object} event
         */
        handleDoubleClickCanvas: function(event) {
            event.preventDefault();
        },
        /**
         * @method hide
         */
        hide: function() {
            this.clear().reset();
            this.stopListening();
            this.undelegateEvents();
        },
        /**
         * @method next
         */
        next: function() {
            if (this.review.next()) {
                console.log('next', true);
            } else {
                console.log('next', false);
                //this.review.save(_.bind(this.container.triggerNext, this));
                this.container.triggerNext();
            }
        },
        /**
         * @method previous
         */
        previous: function() {
            if (this.review.previous()) {
                console.log('previous', true);
            } else {
                console.log('previous', false);
                //this.review.save(_.bind(this.container.triggerPrevious, this));
                this.container.triggerPrevious();
            }
        },
        /**
         * @method reset
         * @param {Prompt}
         */
        reset: function() {
            this.container.$('.prompt-answer').hide();
            this.container.$('.prompt-question').hide();
            return this;
        },
        /**
         * @method show
         * @returns {Prompt}
         */
        show: function() {
            this.listenTo(this.canvas, 'canvas:click', this.handleClickCanvas);
            this.listenTo(this.canvas, 'canvas:clickhold', this.handleClickHoldCanvas);
            this.listenTo(this.canvas, 'canvas:doubleclick', this.handleDoubleClickCanvas);
            return this;
        },
        /**
         * @method showAnswer
         * @returns {Prompt}
         */
        showAnswer: function() {
            return this;
        }
    });

    return Prompt;
});