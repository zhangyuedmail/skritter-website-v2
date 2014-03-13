/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class DataVocabList
     */
    var VocabList = Backbone.Model.extend({
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('vocablists', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        }
    });
    
    return VocabList;
});