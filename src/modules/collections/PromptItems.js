/**
 * @module Application
 */
define([
    'core/modules/GelatoCollection',
    'modules/models/PromptItem'
], function(GelatoCollection, PromptItem) {

    /**
     * @class PromptItems
     * @extends GelatoCollection
     */
    var PromptItems = GelatoCollection.extend({
        /**
         * @property model
         * @type PromptItem
         */
        model: PromptItem
    });

    return PromptItems;

});