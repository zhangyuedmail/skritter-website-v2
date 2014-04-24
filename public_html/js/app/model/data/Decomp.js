/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class DataDecomp
     */
    var Decomp = Backbone.Model.extend({
	/**
         * @property {String} idAttribute
         */
        idAttribute: 'writing',
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('decomps', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        }
    });
    
    return Decomp;
});