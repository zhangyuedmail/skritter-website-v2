/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/prompt-toolbar.html',
    'core/modules/GelatoComponent'
], function(Template, GelatoComponent) {

    /**
     * @class PromptToolbar
     * @extends GelatoComponent
     */
    var PromptToolbar = GelatoComponent.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(options) {
            options = options || {};
            this.prompt = options.prompt;
            this.on('resize', this.resize);
        },
        /**
         * @method render
         * @returns {PromptToolbar}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {
            'vclick .option-correct': 'handleClickOptionCorrect',
            'vclick .option-eraser': 'handleClickOptionEraser',
            'vclick .option-reveal': 'handleClickOptionReveal',
            'vclick .option-stroke-order': 'handleClickOptionStrokeOrder'
        },
        /**
         * @method handleClickOptionCorrect
         * @param {Event} event
         */
        handleClickOptionCorrect: function(event) {
            event.preventDefault();
        },
        /**
         * @method handleClickOptionEraser
         * @param {Event} event
         */
        handleClickOptionEraser: function(event) {
            event.preventDefault();
            this.prompt.character().reset();
            this.prompt.renderPrompt();
        },
        /**
         * @method handleClickOptionReveal
         * @param {Event} event
         */
        handleClickOptionReveal: function(event) {
            event.preventDefault();
            var nextShape = this.prompt.character().getExpectedTargets()[0].getShape();
            this.prompt.canvas.clearLayer('surface-background2');
            this.prompt.canvas.drawShape('surface-background2', nextShape, {color: '#b3b3b3'});
        },
        /**
         * @method handleClickOptionStroke
         * @param {Event} event
         */
        handleClickOptionStroke: function(event) {
            event.preventDefault();
        },
        /**
         * @method resize
         * @returns {PromptToolbar}
         */
        resize: function() {
            return this;
        }
    });

    return PromptToolbar;

});