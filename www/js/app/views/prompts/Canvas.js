/**
 * @module Application
 */
define([
    "framework/GelatoView",
    "requirejs.text!templates/prompts-canvas.html"
], function(GelatoView, template) {
    return GelatoView.extend({
        /**
         * @class PromptCanvas
         */
        initialize: function() {
            this.stages = {};
        },
        /**
         * @property el
         * @type String
         */
        el: "#canvas-container",
        /**
         * @method render
         * @returns {PromptCanvas}
         */
        render: function() {
            this.$el.html(template);
            this.elements.canvasHolder = this.$(".canvas-holder");
            this.elements.canvasDisplay = this.$(".display");
            this.elements.canvasInput = this.$(".input");
            this.stages.display = this.createDisplayStage();
            this.stages.input = this.createInputStage();
            createjs.Ticker.addEventListener('tick', this.stages.display);
            createjs.Touch.enable(this.stages.input);
            createjs.Ticker.setFPS(24);
            this.resize(app.getContentWidth());
            return this;
        },
        /**
         * @method createDisplayStage
         * @returns {createjs.Stage}
         */
        createDisplayStage: function() {
            var stage = new createjs.Stage(this.elements.canvasDisplay[0]);
            stage.autoClear = true;
            stage.enableDOMEvents(false);
            return stage;
        },
        /**
         * @method createInputStage
         * @returns {createjs.Stage}
         */
        createInputStage: function() {
            var stage = new createjs.Stage(this.elements.canvasInput[0]);
            stage.autoClear = false;
            stage.enableDOMEvents(true);
            return stage;
        },
        /**
         * @method resize
         * @param {Number} size
         * @returns {PromptCanvas}
         */
        resize: function(size) {
            this.size = size;
            this.elements.canvasHolder[0].style.height = this.size + 'px';
            this.elements.canvasHolder[0].style.width = this.size + 'px';
            this.elements.canvasDisplay[0].height = this.size;
            this.elements.canvasDisplay[0].width = this.size;
            this.elements.canvasInput[0].height = this.size;
            this.elements.canvasInput[0].width = this.size;
            return this;
        }
    });
});