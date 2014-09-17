/**
 * @module Application
 */
define([
    'prompts/Prompt'
], function(Prompt) {
    /**
     * @class PromptTone
     * @extends {Prompt}
     */
    var PromptTone = Prompt.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
        },
        /**
         * @method render
         * @returns {PromptTone}
         */
        render: function() {
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
