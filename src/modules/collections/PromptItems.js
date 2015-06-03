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
         * @method getVocabId
         * @returns {String}
         */
        getVocabId: function() {
            return this.at(0).get('vocabId');
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
            return app.user.data.vocabs.get(this.id);
        },
        /**
         * @method isFirst
         * @returns {Boolean}
         */
        isFirst: function() {
            return this.position <= 0;
        },
        /**
         * @method isLast
         * @returns {Boolean}
         */
        isLast: function() {
            return this.position >= this.length - 1;
        },
        /**
         * @method next
         * @return {Boolean}
         */
        next: function() {
            if (this.isLast()) {
                return false;
            }
            this.position++;
            return true;
        },
        /**
         * @method previous
         * @return {Boolean}
         */
        previous: function() {
            if (this.isFirst()) {
                return false;
            }
            this.position--;
            return true;
        }
    });

    return PromptItems;

});