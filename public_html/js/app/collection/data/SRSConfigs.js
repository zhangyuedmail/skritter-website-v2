/**
 * @module Skritter
 * @submodule Collections
 * @param SRSConfig
 * @author Joshua McFarland
 */
define([
    'model/data/SRSConfig'
], function(SRSConfig) {
    /**
     * @class DataSRSConfigs
     */
    var SRSConfigs = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @property {Backbone.Model} model
         */
        model: SRSConfig,
        /**
         * @method insert
         * @param {Array|Object} srsconfigs
         * @param {Function} callback
         */
        insert: function(srsconfigs, callback) {
            skritter.storage.put('srsconfigs', srsconfigs, callback);
            srsconfigs = null;
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('srsconfigs', _.bind(function(reviews) {
                this.add(reviews, {merge: true, silent: true, sort: false});
                callback();
            }, this));
        }
    });

    return SRSConfigs;
});