/**
 * @module Skritter
 * @submodule Collections
 * @param Param
 * @author Joshua McFarland
 */
define([
    'model/data/Param'
], function(Param) {
    /**
     * @class DataParams
     */
    var Params = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.add(skritter.fn.params);
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Param
    });

    return Params;
});