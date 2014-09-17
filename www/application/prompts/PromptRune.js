/**
 * @module Application
 */
define([
    'prompts/Prompt',
    'require.text!templates/desktop/prompts/prompt-rune.html'
], function(Prompt, DesktopTemplate) {
    /**
     * @class PromptRune
     * @extends {Prompt}
     */
    var PromptRune = Prompt.extend({
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
         * @returns {PromptRune}
         */
        render: function() {
            this.$el.prepend(this.compile(DesktopTemplate));
            return this;
        },
        /**
         * @method renderElements
         * @returns {PromptRune}
         */
        renderElements: function() {
            return this;
        }
    });

    return PromptRune;
});
