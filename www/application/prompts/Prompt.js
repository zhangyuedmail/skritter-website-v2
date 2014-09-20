/**
 * @module Application
 */
define([
    'framework/BaseView'
], function(BaseView) {
    /**
     * @class Prompt
     * @extends {BaseView}
     */
    var Prompt = BaseView.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @param {PromptController} controller
         * @param {DataReview} review
         * @constructor
         */
        initialize: function(options, controller, review) {
            this.canvas = controller.canvas;
            this.controller = controller;
            this.gradingButtons = controller.gradingButtons;
            this.review = review;
        },
        /**
         * @property el
         * @type String
         */
        el: '.detail-container',
        /**
         * @method render
         * @returns {Prompt}
         */
        render: function() {
            console.log(this.review.getItem().id.split('-')[2], this.review.getPosition());
            this.enableGradingListeners();
            this.resize();
            return this;
        },
        /**
         * @method renderElements
         * @returns {Prompt}
         */
        renderElements: function() {
            console.log('POSITION', this.review.getPosition());
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BaseView.prototype.events, {
            'vclick': 'handlePromptClicked'
        }),
        /**
         * @method enableCanvasListeners
         * @returns {Prompt}
         */
        enableCanvasListeners: function() {
            this.listenTo(this.canvas, 'canvas:click', this.handleCanvasClicked);
            this.listenTo(this.canvas, 'canvas:clickhold', this.handleCanvasHeld);
            this.listenTo(this.canvas, 'canvas:doubleclick', this.handleCanvasDoubleClicked);
            this.listenTo(this.canvas, 'canvas:swipeup', this.handleCanvasSwipeUp);
            this.listenTo(this.canvas, 'input:down', this.handleInputDown);
            this.listenTo(this.canvas, 'input:up', this.handleInputUp);
            return this;
        },
        /**
         * @method enableGradingListeners
         * @returns {Prompt}
         */
        enableGradingListeners: function() {
            this.listenTo(this.gradingButtons, 'complete', this.handleGradingButtonsCompleted);
            this.listenTo(this.gradingButtons, 'selected', this.handleGradingButtonsSelected);
            return this;
        },
        /**
         * @method handleGradingButtonsCompleted
         */
        handleGradingButtonsCompleted: function() {
            this.next();
        },
        /**
         * @method handleGradingButtonsSelected
         */
        handleGradingButtonsSelected: function(grade) {
            this.review.setAt('score', grade);
        },
        /**
         * @method handlePromptClicked
         * @param {Event} event
         */
        handlePromptClicked: function(event) {
            event.preventDefault();
        },
        /**
         * @method next
         */
        next: function() {
            if (this.review.isLast()) {
                this.controller.triggerNext();
            } else {
                this.review.next();
                this.reset().render();
            }
        },
        /**
         * @method reset
         * @returns {Prompt}
         */
        reset: function() {
            this.canvas.hide();
            this.gradingButtons.hide();
            return this;
        },
        /**
         * @method resize
         * @returns {Prompt}
         */
        resize: function() {
            return this;
        }
    });

    return Prompt;
});
