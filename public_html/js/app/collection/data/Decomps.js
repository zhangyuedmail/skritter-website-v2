/**
 * @module Skritter
 * @submodule Collections
 * @param Decomp
 * @author Joshua McFarland
 */
define([
    'model/data/Decomp'
], function(Decomp) {
    /**
     * @class DataDecomps
     */
    var Decomps = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Decomp,
        /**
         * @method insert
         * @param {Array|Object} decomps
         * @param {Function} callback
         */
        insert: function(decomps, callback) {
            skritter.storage.put('decomps', decomps, callback);
            decomps = null;
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('decomps', _.bind(function(items) {
                this.add(items, {merge: true, silent: true, sort: false});
                callback();
            }, this));
        }
    });

    return Decomps;
});