/**
 * @module Application
 */
define([
    'prompts/Prompt',
    'require.text!templates/desktop/prompts/prompt-rdng.html'
], function(Prompt, DesktopTemplate) {
    /**
     * @class PromptRdng
     * @extends {Prompt}
     */
    var PromptRdng = Prompt.extend({
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
         * @returns {PromptRdng}
         */
        render: function() {
            this.$el.prepend(this.compile(DesktopTemplate));
            return this;
        },
        /**
         * @method renderElements
         * @returns {PromptRdng}
         */
        renderElements: function() {
            return this;
        }
    });

    return PromptRdng;
});
