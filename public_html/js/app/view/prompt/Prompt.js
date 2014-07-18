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
            View.prototype.initialize.call(this);
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
            this.elements.navigateLeft.hide();
            this.elements.navigateRight.hide();
            if (this.vocab.isNew()) {
                this.elements.promptNewness.show();
            } else {
                this.elements.promptNewness.hide();
            }
            if (this.vocab.getStyle()) {
                this.elements.promptStyle.text(this.vocab.getStyle().toUpperCase());
                this.elements.promptStyle.show();
            } else {
                this.elements.promptStyle.hide();
            }
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
            this.listenTo(this.gradingButtons, 'complete', this.handleGradingComplete);
            this.listenTo(this.gradingButtons, 'selected', this.handleGradingSelected);
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
         * @method handleClickEraser
         * @param event
         */
        handleClickEraser: function(event) {
            event.preventDefault();
        },
        /**
         * @method handleGradingComplete
         * @param {Object} event
         */
        handleGradingComplete: function(event) {
            this.next();
            event.preventDefault();
        },
        /**
         * @method handleGradingSelected
         * @param {Object} event
         * @param {Number} score
         */
        handleGradingSelected: function(event, score) {
            this.review.setContained('score', score);
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
         * @method handleClickReveal
         * @param event
         */
        handleClickReveal: function(event) {
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
                this.reset().show();
            } else {
                this.review.set('done', true);
                this.review.save(_.bind(this.container.triggerNext, this.container));
            }
        },
        /**
         * @method previous
         */
        previous: function() {
            if (this.review.previous()) {
                this.reset().show();
            } else {
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
            if (!this.review.isFinished()) {
                skritter.timer.start();
            }
            return this;
        },
        /**
         * @method showAnswer
         * @returns {Prompt}
         */
        showAnswer: function() {
            skritter.timer.stop();
            if (!this.review.isFinished()) {
                this.review.setContained({
                    finished: true,
                    reviewTime: skritter.timer.getReviewTime(),
                    thinkingTime: skritter.timer.getThinkingTime()
                });
                skritter.timer.reset();
            }
            return this;
        }
    });

    return Prompt;
});