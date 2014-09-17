/**
 * @module Application
 */
define([
    'prompts/Prompt'
], function(Prompt) {
    /**
     * @class PromptDefn
     * @extends {Prompt}
     */
    var PromptDefn = Prompt.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
        },
        /**
         * @method render
         * @returns {PromptDefn}
         */
        render: function() {
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
