define([], function() {
    /**
     * @class DataVocab
     */
    var Vocab = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('vocabs', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method getContainedItemIds
         * @param {String} part
         * @returns {Array}
         */
        getContainedItemIds: function(part) {
            var containedItemIds = [];
            var containedVocabIds = this.get('containedVocabIds');
            if (containedVocabIds && part === 'rune') {
                for (var a = 0, lengthA = containedVocabIds.length; a < lengthA; a++) {
                    containedItemIds.push(skritter.user.id + '-' + containedVocabIds[a] + '-' + part);
                }
            } else if (containedVocabIds && part === 'tone') {
                for (var b = 0, lengthB = containedVocabIds.length; b < lengthB; b++) {
                    var splitId = containedVocabIds[b].split('-');
                    containedItemIds.push(skritter.user.id + '-' + splitId[0] + '-' + splitId[1] + '-0-' + part);
                }
            }
            return containedItemIds;
        }
    });

    return Vocab;
}); 