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
        }
    });

    return Vocab;
}); 