/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class DataVocab
     */
    var Vocab = Backbone.Model.extend({
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('vocabs', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method containedItemIds
         * @param {String} part
         * @returns {Array}
         */
        containedItemIds: function(part) {
            var containedItemIds = [];
            if (part && part === 'rune' || part === 'tone') {
                var containedVocabIds = this.has('containedVocabIds') ? this.get('containedVocabIds') : [];
                for (var i = 0, length = containedVocabIds.length; i < length; i++)
                    containedItemIds.push(skritter.user.id + '-' + containedVocabIds[i] + '-' + part);
            }
            return containedItemIds;
        },
    });

    return Vocab;
}); 