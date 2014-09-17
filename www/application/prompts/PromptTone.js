/**
 * @module Application
 */
define([
    'prompts/Prompt',
    'require.text!templates/desktop/prompts/prompt-tone.html'
], function(Prompt, DesktopTemplate) {
    /**
     * @class PromptTone
     * @extends {Prompt}
     */
    var PromptTone = Prompt.extend({
        /**
         * @method initialize
         * @param {PromptController} controller
         * @constructor
         */
        initialize: function(controller) {
            Prompt.prototype.initialize.call(this, controller);
        },
        /**
         * @method render
         * @returns {PromptTone}
         */
        render: function() {
            this.$el.prepend(this.compile(DesktopTemplate));
            return this;
        },
        /**
         * @method renderElements
         * @returns {PromptTone}
         */
        renderElements: function() {
            return this;
        }
    });

    return PromptTone;
});
