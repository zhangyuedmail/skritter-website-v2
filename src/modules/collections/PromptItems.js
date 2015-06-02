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
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.part = null;
            this.position = 0;
        },
        /**
         * @property model
         * @type PromptItem
         */
        model: PromptItem,
        /**
         * @method getCharacter
         * @returns {CanvasCharacter}
         */
        getCharacter: function() {
            return this.getItem().get('character');
        },
        /**
         * @method getItem
         * @returns {PromptItem}
         */
        getItem: function() {
            return this.at(this.position);
        },
        /**
         * @method getVocab
         * @returns {DataVocab}
         */
        getVocab: function() {
            return this.at(0).getVocab();
        },
        isFirst: function() {

        },
        isLast: function() {

        },
        next: function() {

        },
        previous: function() {

        }
    });

    return PromptItems;

});