/**
 * @module Skritter
 * @submodule Collections
 * @param Decomp
 * @author Joshua McFarland
 */
define([
    'models/data/Decomp'
], function(Decomp) {
    /**
     * @class DataDecomps
     */
    var Decomps = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change', function(decomp) {
                decomp.cache();
            });
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Decomp,
        /**
         * @method insert
         * @param {Array} decomps
         * @param {Function} callback
         */
        insert: function(decomps, callback) {
            var self = this;
            skritter.storage.put('decomps', decomps, function() {
                //self.add(decomps, {merge: true, silent: true});
                callback();
            });
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            skritter.storage.getAll('decomps', function(items) {
                self.add(items, {merge: true, silent: true});
                callback();
            });
        }
    });

    return Decomps;
});