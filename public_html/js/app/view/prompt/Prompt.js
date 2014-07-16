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
            this.gradingButtons = null;
            this.review = null;
            this.teachingButtons = null;
            this.vocab = null;
        },
        /**
         * @method renderFields
         * @param {Prompt}
         */
        renderFields: function() {
            return this;
        },
        /**
         * @method disableListeners
         */
        disableListeners: function() {
            this.stopListening();
        },
        /**
         * @method enableListeners
         */
        enableListeners: function() {
            this.listenTo(this.canvas, 'canvas:click', this.handleClickCanvas);
            this.listenTo(this.canvas, 'canvas:clickhold', this.handleClickHoldCanvas);
            this.listenTo(this.canvas, 'canvas:doubleclick', this.handleDoubleClickCanvas);
            this.listenTo(this.canvas, 'input:down', this.handleInputDown);
            this.listenTo(this.canvas, 'input:up', this.handleInputUp);
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
         * @method handleInputDown
         * @param {Object} event
         */
        handleInputDown: function(event) {
            event.preventDefault();
        },
        /**
         * @method handleInputUp
         * @param {Object} event
         */
        handleInputUp: function(event) {
            event.preventDefault();
        },
        /**
         * @method hide
         */
        hide: function() {
            this.disableListeners();
            this.undelegateEvents();
        },
        /**
         * @method next
         */
        next: function() {
            if (this.review.next()) {
                console.log('next', true);
                this.reset().renderFields();
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
                this.reset().renderFields();
            } else {
                console.log('previous', false);
                //this.review.save(_.bind(this.container.triggerPrevious, this));
                this.container.triggerPrevious();
            }
        },
        /**
         * @method reset
         * @returns {Prompt}
         */
        reset: function() {
            this.gradingButtons.hide();
            this.teachingButtons.hide();
            return this;
        },
        /**
         * @method resize
         */
        resize: function() {
        },
        /**
         * @method show
         * @returns {Prompt}
         */
        show: function() {
            skritter.timer.setLapOffset(this.review.getLapOffset())
            skritter.timer.setThinkingValue(this.review.getThinkingTime());
            skritter.timer.start();
            return this;
        },
        /**
         * @method showAnswer
         * @returns {Prompt}
         */
        showAnswer: function() {
            skritter.timer.stop();
            this.review.setContained({
                finished: true,
                reviewTime: skritter.timer.getReviewTime(),
                thinkingTime: skritter.timer.getThinkingTime()
            });
            return this;
        }
    });

    return Prompt;
});