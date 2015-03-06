/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/prompt-toolbar.html',
    'core/modules/GelatoView'
], function(Template, GelatoView) {

    /**
     * @class PromptToolbar
     * @extends GelatoView
     */
    var PromptToolbar = GelatoView.extend({
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
            'vclick .option-eraser': 'handleClickOptionEraser',
            'vclick .option-reveal': 'handleClickOptionReveal'
        },
        /**
         * @method handleClickOptionEraser
         * @param {Event} event
         */
        handleClickOptionEraser: function(event) {
            event.preventDefault();
            this.prompt.character().reset();
            this.prompt.renderCharacter();
        },
        /**
         * @method handleClickOptionReveal
         * @param {Event} event
         */
        handleClickOptionReveal: function(event) {
            event.preventDefault();
            var shape = this.prompt.character().getExpectedTargets()[0].getShape();
            this.prompt.canvas.clearLayer('surface-background2');
            this.prompt.canvas.drawShape('surface-background2', shape, {color: '#b3b3b3'});
        },
        /**
         * @method hide
         * @returns {PromptToolbar}
         */
        hide: function() {
            this.$el.hide();
            return this;
        },
        /**
         * @method resize
         * @returns {PromptToolbar}
         */
        resize: function() {
            return this;
        },
        /**
         * @method show
         * @returns {PromptToolbar}
         */
        show: function() {
            this.$el.show();
            return this;
        }
    });

    return PromptToolbar;

});