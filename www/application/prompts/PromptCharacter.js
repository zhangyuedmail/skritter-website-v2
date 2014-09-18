/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'prompts/PromptStroke'
], function(BaseCollection, PromptStroke) {
    /**
     * @class PromptCharacter
     * @extend BaseCollection
     */
    var PromptCharacter = BaseCollection.extend({
        /**
         * @property model
         * @type PromptStroke
         */
        model: PromptStroke
    });

    return PromptCharacter;
});
