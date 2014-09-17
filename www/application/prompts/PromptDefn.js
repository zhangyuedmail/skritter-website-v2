/**
 * @module Application
 */
define([
    'prompts/Prompt',
    'require.text!templates/desktop/prompts/prompt-defn.html'
], function(Prompt, DesktopTemplate) {
    /**
     * @class PromptDefn
     * @extends {Prompt}
     */
    var PromptDefn = Prompt.extend({
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
         * @returns {PromptDefn}
         */
        render: function() {
            this.$el.prepend(this.compile(DesktopTemplate));
            return this;
        },
        /**
         * @method renderElements
         * @returns {PromptDefn}
         */
        renderElements: function() {
            return this;
        }
    });

    return PromptDefn;
});
