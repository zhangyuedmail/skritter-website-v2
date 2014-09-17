/**
 * @module Application
 */
define([
    'prompts/Prompt'
], function(Prompt) {
    /**
     * @class PromptRune
     * @extends {Prompt}
     */
    var PromptRune = Prompt.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
        },
        /**
         * @method render
         * @returns {PromptRune}
         */
        render: function() {
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
